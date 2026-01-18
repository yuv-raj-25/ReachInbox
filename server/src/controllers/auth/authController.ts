import type { Request, Response } from 'express'
import {
  registerEmailUser,
  loginEmailUser,
  loginWithGoogle
} from '../../services/auth.service.js'
import { asyncHandler } from '../../utility/asynHandler.js'
import { ApiResponse } from '../../utility/apiResponse.js'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  const result = await registerEmailUser(email, password, name)
  
  res.status(201).json(
    new ApiResponse(result, 'User registered successfully', 201)
  )
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await loginEmailUser(email, password)
  
  res.status(200).json(
    new ApiResponse(result, 'Login successful', 200)
  )
})

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body
  const result = await loginWithGoogle(idToken)
  
  res.status(200).json(
    new ApiResponse(result, 'Google authentication successful', 200)
  )
})

export const logout = asyncHandler(async (req: Request & { user?: any }, res: Response) => {

  const userId = req.user?.userId
  
  res.status(200).json(
    new ApiResponse(null, 'Logout successful', 200)
  )
}) 
