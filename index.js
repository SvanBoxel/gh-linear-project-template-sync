import { updateLinearTemplate } from './update-linear-template.js'
import fs from 'fs'
import path from 'path'

const projectFolder = path.join(process.cwd(), process.env.PROJECT_FOLDER)
const issues = fs.readdirSync(`${projectFolder}/issues/`).map(file => path.join(`${projectFolder}/issues/`, file))

updateLinearTemplate(`${projectFolder}/project-main.md`, issues)
  .then(() => console.log('Template updated successfully'))
  .catch(error => console.error('Error updating template:', error))
