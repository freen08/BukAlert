import { useRef, useEffect, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { EmergencyTeam } from '../lib/supabase'

interface GoogleMapProps {
  emergencyTeams: EmergencyTeam[]
  userLocation: google.maps.LatLngLiteral | null
  onTeamClick: (team: EmergencyTeam) => void
}

const MapComponent = ({ emergencyTeams, userLocation, onTeamClick }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 8.1542, lng: 125.1256 }, // Center of Bukidnon
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    }

    const newMap = new google.maps.Map(mapRef.current, mapOptions)
    googleMapRef.current = newMap
    setMap(newMap)
  }, [])

  // Add markers for emergency teams
  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    emergencyTeams.forEach(team => {
      const markerColor = team.type === 'mdrrm' ? 'red' :
                         team.type === 'police' ? 'blue' : 'orange'

      const marker = new google.maps.Marker({
        position: { lat: team.latitude, lng: team.longitude },
        map: map,
        title: team.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      })

      marker.addListener('click', () => {
        onTeamClick(team)
      })

      markersRef.current.push(marker)
    })
  }, [map, emergencyTeams, onTeamClick])

  // Center map on user location when available
  useEffect(() => {
    if (!map || !userLocation) return

    map.setCenter(userLocation)
    map.setZoom(12)
  }, [map, userLocation])

  return <div ref={mapRef} className="w-full h-full" />
}

const LoadingComponent = () => <div className="flex items-center justify-center h-full">Loading map...</div>

const ErrorComponent = () => <div className="flex items-center justify-center h-full text-red-500">Error loading map</div>

export const GoogleMap = (props: GoogleMapProps) => {
  const apiKey = 'AIzaSyBUV8Ag1aOioVL3SErpMIItjsGAbnE9sR4'

  return (
    <Wrapper apiKey={apiKey} libraries={['places']}>
      <MapComponent {...props} />
    </Wrapper>
  )
}
