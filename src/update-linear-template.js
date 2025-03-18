import loadAndParseMarkdown from './parse-markdown.js'
import { getLinearClient } from './linear-client.js'

export async function getLabels (labelNames) {
  const labels = await (await getLinearClient().team(process.env.LINEAR_TEAM_ID)).labels()
  return labels.nodes.filter(l => labelNames.some(n => l.name.toLowerCase().includes(n.toLowerCase()))).map(l => l.id)
}

export async function updateLinearTemplate (projectTemplate, issues) {
  const teamId = process.env.LINEAR_TEAM_ID
  const templateId = process.env.LINEAR_TEMPLATE_ID

  try {
    const { header, content } = await loadAndParseMarkdown(projectTemplate)

    const initialIssues = await Promise.all(
      issues.map(async (issue) => {
        console.log('parsing', issue)
        const { header, content } = await loadAndParseMarkdown(issue)

        return {
          title: header.title,
          labelIds: await getLabels(header.labels.split(',')),
          teamId,
          priority: header.priority,
          descriptionData: content
        }
      })
    )

    console.log('updating template')
    const result = await getLinearClient().updateTemplate(templateId, {
      name: header.name,
      templateData: {
        title: header.title,
        descriptionData: content,
        initialIssues
      },
      teamId
    })

    console.log('Template updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}
