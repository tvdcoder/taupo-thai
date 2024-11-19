import { NextResponse } from 'next/server'
import stripe from '../../../stripe-config'



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({ status: session.status })
  } catch (error) {
    console.error('Error fetching Stripe session:', error)
    return NextResponse.json({ error: 'Failed to fetch Stripe session' }, { status: 500 })
  }
}