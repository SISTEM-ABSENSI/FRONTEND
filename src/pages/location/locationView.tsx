import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

export default function LocationView() {
  // Fake data for GPS locations
  const fakeData: any[] = [
    {
      gpsLocationId: '1',
      gpsLocationLatitude: '-6.1754',
      gpsLocationLongitude: '106.8272',
      user: { userName: 'User 1' }
    },
    {
      gpsLocationId: '2',
      gpsLocationLatitude: '-6.2000',
      gpsLocationLongitude: '106.8500',
      user: { userName: 'User 2' }
    },
    {
      gpsLocationId: '3',
      gpsLocationLatitude: '-6.1500',
      gpsLocationLongitude: '106.7800',
      user: { userName: 'User 3' }
    }
  ]

  const [coordinates, setCoordintes] = useState<any[]>(fakeData)

  useEffect(() => {
    // Normally here you would call API, but now we're using fakeData
    setCoordintes(fakeData)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Normally here you would fetch new data, but now we're simulating with static data
      setCoordintes(fakeData)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <MapContainer
      center={[-6.1754, 106.8272]}
      zoom={5}
      maxZoom={20}
      style={{
        height: '75vh'
      }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {coordinates.map((item) => {
        return (
          <Marker
            key={item.gpsLocationId}
            position={[+item.gpsLocationLatitude, +item.gpsLocationLongitude]}
          >
            <Popup>
              <h1>{item?.user?.userName}</h1>
              <small>Latitude: {item.gpsLocationLatitude}</small>
              <small>Longitude: {item.gpsLocationLongitude}</small>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
