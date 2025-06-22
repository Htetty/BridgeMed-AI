import Vapi from '@vapi-ai/web'

// Get API key from environment variable
const VAPI_PUBLIC_KEY = process.env.REACT_APP_VAPI_PUBLIC_KEY

// Create and export a single Vapi instance
export const vapi = new Vapi(VAPI_PUBLIC_KEY || '') 