import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

const tableNodeSpec = {
  table: {
    content: "table_row+",
    tableRole: "table",
    isolating: true,
    group: "block",
    parseDOM: [{ tag: "table" }],
    toDOM() { return ["table", { class: "pm-table" }, 0] }
  },
  table_row: {
    content: "(table_cell | table_header)+",
    tableRole: "row",
    parseDOM: [{ tag: "tr" }],
    toDOM() { return ["tr", 0] }
  },
  table_cell: {
    content: "block+",
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 }
    },
    tableRole: "cell",
    isolating: true,
    parseDOM: [{ tag: "td", getAttrs: dom => ({
      colspan: dom.getAttribute("colspan") || 1,
      rowspan: dom.getAttribute("rowspan") || 1
    }) }],
    toDOM(node) { 
      const attrs = {};
      if (node.attrs.colspan > 1) attrs.colspan = node.attrs.colspan;
      if (node.attrs.rowspan > 1) attrs.rowspan = node.attrs.rowspan;
      return ["td", attrs, 0] 
    }
  },
  table_header: {
    content: "block+",
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 }
    },
    tableRole: "header_cell",
    isolating: true,
    parseDOM: [{ tag: "th", getAttrs: dom => ({
      colspan: dom.getAttribute("colspan") || 1,
      rowspan: dom.getAttribute("rowspan") || 1
    }) }],
    toDOM(node) { 
      const attrs = {};
      if (node.attrs.colspan > 1) attrs.colspan = node.attrs.colspan;
      if (node.attrs.rowspan > 1) attrs.rowspan = node.attrs.rowspan;
      return ["th", attrs, 0] 
    }
  }
};

function createExtendedSchema() {
  const nodes = addListNodes(basicSchema.spec.nodes, "paragraph block*", "block");
  
  return new Schema({
    nodes: nodes
    .addToEnd("table", tableNodeSpec.table)
    .addToEnd("table_row", tableNodeSpec.table_row)
    .addToEnd("table_cell", tableNodeSpec.table_cell)
    .addToEnd("table_header", tableNodeSpec.table_header),
    marks: basicSchema.spec.marks
  });
}

export default createExtendedSchema;