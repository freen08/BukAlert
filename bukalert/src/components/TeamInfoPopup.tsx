import type { EmergencyTeam } from '../lib/supabase'
import { Phone, Video, Bookmark } from 'lucide-react'

interface TeamInfoPopupProps {
  team: EmergencyTeam | null
  userLocation: google.maps.LatLngLiteral | null
  onClose: () => void
  onVideoCall: (team: EmergencyTeam) => void
  onBookmark: (team: EmergencyTeam) => void
  isBookmarked: boolean
}

export const TeamInfoPopup = ({
  team,
  userLocation,
  onClose,
  onVideoCall,
  onBookmark,
  isBookmarked
}: TeamInfoPopupProps) => {
  if (!team) return null

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, team.latitude, team.longitude).toFixed(1)
    : null

  const getTeamTypeColor = (type: string) => {
    switch (type) {
      case 'mdrrm': return 'bg-red-500'
      case 'police': return 'bg-blue-500'
      case 'fire': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getTeamTypeName = (type: string) => {
    switch (type) {
      case 'mdrrm': return 'MDRRM'
      case 'police': return 'Police'
      case 'fire': return 'Fire Department'
      default: return type
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getTeamTypeColor(team.type)}`}></div>
            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium">{getTeamTypeName(team.type)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Hotline</p>
            <p className="font-medium flex items-center gap-2">
              <Phone size={16} />
              {team.hotline}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{team.address}</p>
          </div>

          {distance && (
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-medium">{distance} km away</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onVideoCall(team)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Video size={18} />
            Video Call
          </button>

          <button
            onClick={() => onBookmark(team)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isBookmarked
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>
    </div>
  )
}
