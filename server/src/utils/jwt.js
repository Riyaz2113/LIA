const jwt = require('jsonwebtoken');

/**
 * JWT Utilities
 * All token generation and verification is centralised here.
 * Payload contains minimum identity: userId + role only.
 * Never include passwords, sensitive profile data, or secrets in the payload.
 */

const JWT_SECRET = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return process.env.JWT_SECRET;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token.
 * @param {string} userId - MongoDB ObjectId as string
 * @param {string} role   - 'STUDENT' | 'FACULTY' | 'ADMIN'
 * @returns {string} signed JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET(),
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify a JWT token and return its decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param {string} token
 * @returns {{ userId: string, role: string, iat: number, exp: number }}
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET());
};

/**
 * Cookie configuration for the authentication token.
 * Used consistently for both setting and clearing the cookie.
 */
const AUTH_COOKIE_NAME = 'lia_token';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,           // Not accessible via document.cookie
    secure: isProduction,     // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };
};

module.exports = { generateToken, verifyToken, AUTH_COOKIE_NAME, getCookieOptions };
