import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { GoogleMap } from '../components/GoogleMap'
import { TeamInfoPopup } from '../components/TeamInfoPopup'
import { DashboardControls } from '../components/DashboardControls'
import { supabase, EmergencyTeam } from '../lib/supabase'
import { LogOut } from 'lucide-react'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { toggleBookmark, isTeamBookmarked, getBookmarkedTeamIds, bookmarks: bookmarkData } = useBookmarks()
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [emergencyTeams, setEmergencyTeams] = useState<EmergencyTeam[]>([])
  const [selectedTeam, setSelectedTeam] = useState<EmergencyTeam | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample emergency teams data for Bukidnon
  const sampleTeams: EmergencyTeam[] = [
    {
      id: '1',
      name: 'MDRRMC Pangantucan Rescue Team',
      type: 'mdrrm',
      hotline: '+63 917 123 4567',
      latitude: 7.8333,
      longitude: 124.8333,
      address: 'Pangantucan, Bukidnon'
    },
    {
      id: '2',
      name: 'Bukidnon Provincial Police Office',
      type: 'police',
      hotline: '+63 917 234 5678',
      latitude: 8.1542,
      longitude: 125.1256,
      address: 'Malaybalay City, Bukidnon'
    },
    {
      id: '3',
      name: 'Bukidnon Fire Station',
      type: 'fire',
      hotline: '+63 917 345 6789',
      latitude: 8.1542,
      longitude: 125.1256,
      address: 'Malaybalay City, Bukidnon'
    },
    {
      id: '4',
      name: 'Valencia City MDRRM',
      type: 'mdrrm',
      hotline: '+63 917 456 7890',
      latitude: 7.9064,
      longitude: 125.0944,
      address: 'Valencia City, Bukidnon'
    },
    {
      id: '5',
      name: 'Valencia City Police Station',
      type: 'police',
      hotline: '+63 917 567 8901',
      latitude: 7.9064,
      longitude: 125.0944,
      address: 'Valencia City, Bukidnon'
    },
    {
      id: '6',
      name: 'Valencia City Fire Department',
      type: 'fire',
      hotline: '+63 917 678 9012',
      latitude: 7.9064,
      longitude: 125.0944,
      address: 'Valencia City, Bukidnon'
    }
  ]

  useEffect(() => {
    // Load emergency teams
    setEmergencyTeams(sampleTeams)
    setLoading(false)

    // Get user's current location
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const handleTeamClick = (team: EmergencyTeam) => {
    setSelectedTeam(team)
  }

  const handleVideoCall = (team: EmergencyTeam) => {
    // TODO: Implement video call functionality
    alert(`Video call to ${team.name} will be implemented in the next project`)
  }

  const handleBookmark = async (team: EmergencyTeam) => {
    await toggleBookmark(team.id)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BukAlert</h1>
            <p className="text-sm text-gray-600">Emergency Response System</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Welcome, {user?.full_name}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        <GoogleMap
          emergencyTeams={emergencyTeams}
          userLocation={userLocation}
          onTeamClick={handleTeamClick}
        />
      </div>

      {/* Bottom Controls */}
      <DashboardControls
        userLocation={userLocation}
        onLocationClick={getCurrentLocation}
        bookmarkCount={bookmarkData.length}
      />

      {/* Team Info Popup */}
      <TeamInfoPopup
        team={selectedTeam}
        userLocation={userLocation}
        onClose={() => setSelectedTeam(null)}
        onVideoCall={handleVideoCall}
        onBookmark={handleBookmark}
        isBookmarked={selectedTeam ? isTeamBookmarked(selectedTeam.id) : false}
      />
    </div>
  )
}
