import { LinearClient } from '@linear/sdk'
import dotenv from 'dotenv'

dotenv.config()

function loadLinearClient () {
  if (!process.env.LINEAR_TOKEN) {
    throw new Error('LINEAR_TOKEN environment variable not set')
  }

  return new LinearClient({
    apiKey: process.env.LINEAR_TOKEN
  })
}

let linearClientInstance = null

export function getLinearClient () {
  if (!linearClientInstance) {
    linearClientInstance = loadLinearClient()
  }
  return linearClientInstance
}

export default linearClientInstance
