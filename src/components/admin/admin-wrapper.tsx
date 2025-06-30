'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AdminWrapperProps {
  children: React.ReactNode
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      if (!session?.user || (session.user as any).role !== 'ADMIN') {
        router.push('/')
        return
      }
    }
  }, [status, session, router])

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not admin
  if (status === 'unauthenticated' || !session?.user || (session.user as any).role !== 'ADMIN') {
    return null
  }

  // Render the admin content
  return <>{children}</>
} 