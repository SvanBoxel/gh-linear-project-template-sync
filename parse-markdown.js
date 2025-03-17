import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import markdownItTable from 'markdown-it-multimd-table';
import { DOMParser } from 'prosemirror-model';
import { JSDOM } from 'jsdom';
import { Transform } from 'prosemirror-transform';
import mime from 'mime-types';

import createExtendedSchema from './schema.js';
import uploadFileToLinear from './upload-file-to-linear.js';

async function replaceAllImagesInDoc(doc, replacementFn) {
  const tr = new Transform(doc);
  const imagesToUpdate = [];
  
  // First pass: collect all images and their positions
  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (node.type.name === 'image') {
      imagesToUpdate.push({ node, pos });
    }
    return true;
  });
  
  // Second pass: update images in reverse order to avoid position shifts
  for (let i = imagesToUpdate.length - 1; i >= 0; i--) {
    const { node, pos } = imagesToUpdate[i];
    const newAttrs = await replacementFn(node.attrs);
    if (newAttrs) {
      tr.setNodeMarkup(pos, null, newAttrs);
    }
  }
  
  return tr.doc;
}

export default async function loadAndParseMarkdown(filename) {
  const filePath = path.join(filename);
  const markdownContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split the content into header and body
  const parts = markdownContent.split('---');
  if (parts.length < 3) {
    throw new Error("Markdown file does not contain a valid header");
  }
  
  const headerLines = parts[1].trim().split('\n');
  const header = {};
  headerLines.forEach(line => {
    if (!line) return;
    const [key, value] = line.split(':').map(part => part.trim());
    header[key] = value.replace(/^["']|["']$/g, '');
  });
  
  const body = parts.slice(2).join('---').trim();
  const md = new MarkdownIt({ html: true });
  
  md.use(markdownItTable, {
    multiline: true,
    rowspan: true,
    headerless: true
  });
  
  const htmlContent = md.render(body);
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const schema = createExtendedSchema();
  const parser = DOMParser.fromSchema(schema);
  
  const content = await replaceAllImagesInDoc(parser.parse(document), async (imageAttrs) => {
    let newSrc = imageAttrs.src
    try {
      let imagePath = path.join(filename, '..', imageAttrs.src)

      const fileBuffer = fs.readFileSync(imagePath);
      const mimeType = mime.lookup(imagePath) || 'application/octet-stream';
      const fileName = path.basename(imagePath);
      const file = new File([fileBuffer], fileName, { type: mimeType });
      const uploadResponse = await uploadFileToLinear(file);
      
      newSrc = uploadResponse;
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    
    return {
      ...imageAttrs,
      src: newSrc,
    };
  })
  
  return { header, content }
}