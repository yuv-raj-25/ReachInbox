import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utility/jwt.js'
import { asyncHandler } from '../utility/asynHandler.js'
import { ApiError } from '../utility/apiError.js'

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw ApiError.unauthorized('Missing authentication token')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw ApiError.unauthorized('Invalid token format')
    }

    try {
      const decoded = verifyToken(token)
      req.user = decoded
      next()
    } catch {
      throw ApiError.unauthorized('Invalid or expired token')
    }
  }
)
