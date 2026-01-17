import type { Request, Response } from 'express'
import { scheduleBulkEmails } from '../../services/email.service.js'
import { asyncHandler } from '../../utility/asynHandler.js'
import { ApiResponse } from '../../utility/apiResponse.js'

export const scheduleEmail = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const emails = await scheduleBulkEmails(req.user.userId, req.body)
  
  res.status(200).json(
    new ApiResponse(emails, 'Emails scheduled successfully', 200)
  )
})
