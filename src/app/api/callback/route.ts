import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { phone, message } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const callbackRequest = await prisma.callbackRequest.create({
      data: {
        userId: session.user.id,
        phone,
        message: message || ''
      }
    })

    return NextResponse.json({
      message: 'Callback request submitted successfully! We will contact you within 24 hours.',
      request: callbackRequest
    })
  } catch (error) {
    console.error('Error creating callback request:', error)
    return NextResponse.json(
      { error: 'Failed to submit callback request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const callbackRequests = await prisma.callbackRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(callbackRequests)
  } catch (error) {
    console.error('Error fetching callback requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch callback requests' },
      { status: 500 }
    )
  }
} 