import { LinearClient } from '@linear/sdk'
import dotenv from 'dotenv'

dotenv.config()

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
})

export default linearClient
