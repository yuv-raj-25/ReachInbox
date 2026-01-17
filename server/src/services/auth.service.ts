import bcrypt from 'bcrypt'
import { db } from '../config/db.js'
import { signToken } from '../utility/jwt.js'
import { OAuth2Client } from 'google-auth-library'
import { ApiError } from '../utility/apiError.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function registerEmailUser(
  email: string,
  password: string,
  name?: string
) {
  // Check if user already exists
  const existingUser = await db.query(
    `SELECT id FROM users WHERE email=$1`,
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw ApiError.conflict('Email already registered')
  }

  const hash = await bcrypt.hash(password, 10)

  const { rows } = await db.query(
    `
    INSERT INTO users (email, password_hash, name, provider)
    VALUES ($1,$2,$3,'email')
    RETURNING id, email, name
    `,
    [email, hash, name]
  )

  const user = rows[0]
  const token = signToken({ userId: user.id, email: user.email })

  return { user, token }
}

export async function loginEmailUser(
  email: string,
  password: string
) {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  )

  const user = rows[0]
  if (!user || !user.password_hash) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const token = signToken({ userId: user.id, email: user.email })

  return { user, token }
}

export async function loginWithGoogle(idToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    throw ApiError.internalError('Google authentication is not configured')
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: clientId
  })

  const payload = ticket.getPayload()
  if (!payload?.email) {
    throw ApiError.unauthorized('Google authentication failed')
  }

  const { email, name, picture } = payload

  let userRes = await db.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  )

  let user = userRes.rows[0]

  if (!user) {
    const insert = await db.query(
      `
      INSERT INTO users (email, name, avatar_url, provider)
      VALUES ($1,$2,$3,'google')
      RETURNING *
      `,
      [email, name, picture]
    )
    user = insert.rows[0]
  }

  const token = signToken({ userId: user.id, email: user.email })

  return { user, token }
}
