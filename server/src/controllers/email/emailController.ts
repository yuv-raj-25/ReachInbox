import type { Request, Response } from 'express'
import { scheduleBulkEmails, fetchScheduledEmails, fetchSentEmails } from '../../services/email.service.js'
import { asyncHandler } from '../../utility/asynHandler.js'
import { ApiResponse } from '../../utility/apiResponse.js'
import { email } from 'zod'

export const scheduleEmail = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const emails = await scheduleBulkEmails(req.user.userId, req.body)
  res.status(200).json(
    new ApiResponse(emails, 'Emails scheduled successfully', 200)
  )
})

export const getScheduledEmails = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const emails = await fetchScheduledEmails(req.user.userId)
  res.status(200).json(
    new ApiResponse(emails, 'Scheduled emails fetched successfully', 200)
  )
})

export const getSentEmails = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const emails = await fetchSentEmails(req.user.userId)
  res.status(200).json(
    new ApiResponse(emails, 'Sent emails fetched successfully', 200)
  )
})
