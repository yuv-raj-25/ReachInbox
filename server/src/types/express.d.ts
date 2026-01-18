import 'express'

declare module 'express' {
  export interface Request {
    user?: {
      userId: string
      email: string
      // Add other user properties here as needed
    }
  }
}
