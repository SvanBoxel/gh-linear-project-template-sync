import { linearClient } from './linear-client.js'
import { loadAndParseMarkdown } from './parse-markdown.js'
import { getLabels } from './get-labels.js'

export async function updateLinearTemplate (projectTemplate, issues) {
  const teamId = process.env.LINEAR_TEAM_ID
  const templateId = process.env.LINEAR_TEMPLATE_ID

  try {
    const { header, content } = await loadAndParseMarkdown(projectTemplate)

    const initialIssues = await Promise.all(
      issues.map(async (issue) => {
        console.log('parsing', issue)
        const