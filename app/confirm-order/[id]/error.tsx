'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'Failed to load order details. Please try again.'}
          </p>
          <div className="space-x-4">
            <Button onClick={() => reset()} variant="outline">
              Try again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}