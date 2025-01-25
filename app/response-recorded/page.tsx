import { CheckCircle } from 'lucide-react'

export default function ResponseRecordedPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
        <CheckCircle className="w-20 h-20 text-[#4CAF50] mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Response Recorded</h1>
        <p className="text-gray-600">Your response has been successfully recorded.</p>
      </div>
    </div>
  )
}