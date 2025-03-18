import fs from 'fs'
import path from 'path'
import { getInput } from '@actions/core'
import { updateLinearTemplate } from './src/update-linear-template.js'
import { getLinearClient } from './src/linear-client.js'

process.env.PROJECT_FOLDER = getInput('project_folder') || process.env.PROJECT_FOLDER
process.env.LINEAR_TEAM_ID = getInput('linear_team_id') || process.env.LINEAR_TEAM_ID
process.env.LINEAR_TEMPLATE_ID = getInput('linear_template_id') || process.env.LINEAR_TEMPLATE_ID
process.env.LINEAR_TOKEN = getInput('linear_token') || process.env.LINEAR_TOKEN

getLinearClient()

const projectFolder = path.join(process.cwd(), process.env.PROJECT_FOLDER)
const issues = fs.readdirSync(`${projectFolder}/issues/`).map(file => path.join(`${projectFolder}/issues/`, file))

updateLinearTemplate(`${projectFolder}/project-template.md`, issues)
  .then(() => console.log('Template updated successfully'))
  .catch(error => console.error('Error updating template:', error))
