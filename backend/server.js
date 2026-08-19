import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Serve static files from public (built React app)
const publicPath = path.join(__dirname, 'public')
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath))
}

// Use DATABASE_PRIVATE_URL if available (Railway), otherwise DATABASE_URL
const dbUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL
if (!dbUrl) {
  console.error('❌ DATABASE_URL or DATABASE_PRIVATE_URL not set')
  process.exit(1)
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
})

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production'

// Verify token middleware
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    )
    
    const token = jwt.sign({ userId: result.rows[0].id }, SECRET_KEY, { expiresIn: '30d' })
    res.json({ token, user: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already exists' })
    }
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '30d' })
    res.json({ token, user: { id: user.id, username: user.username } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Portfolio routes
app.post('/api/portfolios', verifyToken, async (req, res) => {
  try {
    const { name, description, globalDr, vessels, investors } = req.body
    
    const result = await pool.query(
      'INSERT INTO portfolios (user_id, name, description, global_dr, data) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, name, description, globalDr, JSON.stringify({ vessels, investors })]
    )
    
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/portfolios', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/portfolios/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolios WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/portfolios/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, globalDr, vessels, investors } = req.body
    
    const result = await pool.query(
      'UPDATE portfolios SET name = $1, description = $2, global_dr = $3, data = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, description, globalDr, JSON.stringify({ vessels, investors }), req.params.id, req.userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/portfolios/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM portfolios WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SPA fallback - serve index.html for any non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// Initialize database and start server
const PORT = process.env.PORT || 5000

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    global_dr DECIMAL(5,2) DEFAULT 10,
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
`).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 VesselIQ running on port ${PORT}`)
    console.log(`📦 Database connected`)
  })
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message)
  process.exit(1)
})
