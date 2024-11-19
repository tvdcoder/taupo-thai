import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

let activeSessions: { [key: string]: number } = {}

export async function GET() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  
  if (sessionId && activeSessions[sessionId] && Date.now() < activeSessions[sessionId]) {
    return NextResponse.json({ authenticated: true })
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function POST(req: Request) {
  const { password } = await req.json()
  
  if (password === ADMIN_PASSWORD) {
    const sessionId = uuidv4()
    activeSessions[sessionId] = Date.now() + SESSION_DURATION
    
    cookies().set('admin_session', sessionId, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_DURATION / 1000
    })
    
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false }, { status: 401 })
}

export async function DELETE() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  
  if (sessionId) {
    delete activeSessions[sessionId]
    cookies().delete('admin_session')
  }
  
  return NextResponse.json({ success: true })
}