import { createAuthClient } from "better-auth/react"

console.log("We have the current environment: ", import.meta.env.VITE_NODE_ENV)
const PORT = import.meta.env.VITE_NODE_ENV === "DEVELOPMENT" ? 4321 : 5000
export const authClient = createAuthClient({
  baseURL: `http://localhost:${PORT}`
})
