import { MapPin, History, Bookmark as BookmarkIcon } from 'lucide-react'

interface DashboardControlsProps {
  userLocation: google.maps.LatLngLiteral | null
  onLocationClick: () => void
  bookmarkCount: number
}

export const DashboardControls = ({ userLocation, onLocationClick, bookmarkCount }: DashboardControlsProps) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Your Location */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={20} />
            <span className="font-medium">Your Location</span>
          </div>
          <button
            onClick={onLocationClick}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            {userLocation ? 'Update' : 'Get Location'}
          </button>
          {userLocation && (
            <span className="text-sm text-gray-500">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          )}
        </div>

        {/* Call History */}
        <div className="flex items-center gap-2 text-gray-700">
          <History size={20} />
          <span className="font-medium">Call History</span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">0</span>
        </div>

        {/* Bookmarks */}
        <div className="flex items-center gap-2 text-gray-700">
          <BookmarkIcon size={20} />
          <span className="font-medium">Bookmarks</span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">{bookmarkCount}</span>
        </div>
      </div>
    </div>
  )
}
