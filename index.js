import fs from "fs";
import path from "path";

import loadAndParseMarkdown from './parse-markdown.js';
import linearClient from './linear-client.js';

async function getLabels(labelNames) {
  const labels = await (await linearClient.team(process.env.LINEAR_TEAM_ID)).labels();

  return labels.nodes.filter(l => labelNames.some(n => l.name.toLowerCase().includes(n.toLowerCase()))).map(l => l.id);
}

async function updateLinearTemplate(projectTemplate, issues) {
  const teamId = process.env.LINEAR_TEAM_ID;
  const templateId = process.env.LINEAR_TEMPLATE_ID;

  try {
    const { header, content } = await loadAndParseMarkdown(projectTemplate);

    const initialIssues = await Promise.all(
      issues.map(async (issue) => {
        console.log('parsing', issue);
        const { header, content } = await loadAndParseMarkdown(issue);
    
        return {
          title: header.title,
          labelIds: await getLabels(header.labels.split(',')),
          teamId: teamId,
          priority: header.priority,
          descriptionData: content
        };
      })
    );
    
    console.log('updating template');
    const result = await linearClient.updateTemplate(templateId, {
      name: header.name,
      templateData: {
        title: header.title,
        descriptionData: content,
        initialIssues: initialIssues
      },
      teamId: teamId
    });

    console.log("Template updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
}

async function loadTemplate(templateId) {
  try {
    const template = await linearClient.template(templateId);
    console.log("Template loaded successfully:", template.templateData.initialIssues);
    return template;
  } catch (error) {
    console.error("Error loading template:", error);
    throw error;
  }
}

const projectFolder = '../solutions-engineering/onboarding';
const issues = fs.readdirSync(`${projectFolder}/issues/`).map(file => path.join(`${projectFolder}/issues/`, file));

updateLinearTemplate(`${projectFolder}/project-main.md`, issues);
