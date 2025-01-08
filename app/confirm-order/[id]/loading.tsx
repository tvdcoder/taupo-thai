export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4">
          <div className="animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 mx-auto w-1/2"></div>
            
            <div className="space-y-4 mb-6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            <div className="border-t border-b border-dashed py-4 mb-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }