import React, { useState, useEffect } from 'react'

function App () {
  const [status, setStatus] = useState(
    "Geo-lokatsiya ma'lumotlari olinmoqda..."
  )
  const [speed, setSpeed] = useState(0)
  const [previousPosition, setPreviousPosition] = useState(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        pos => calculateSpeed(pos),
        err => {
          setStatus("Geo-lokatsiya ma'lumotlari olinmadi!")
        },
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId) // Cleanup watch on unmount
    } else {
      setStatus(
        "Sizning brauzeringiz geo-lokatsiya funksiyasini qo'llab-quvvatlamaydi!"
      )
    }
  }, [previousPosition]) // Dependency array includes the previous position

  const calculateSpeed = pos => {
    const { latitude, longitude } = pos.coords
    const currentTime = pos.timestamp

    if (previousPosition) {
      const distance = getDistance(
        latitude,
        longitude,
        previousPosition.latitude,
        previousPosition.longitude
      )
      const timeElapsed = (currentTime - previousPosition.time) / 1000 // Sekundlarda
      const currentSpeed = (distance / timeElapsed) * 3600 // m/soat -> km/soat
      setSpeed(currentSpeed.toFixed(2)) // Tezlikni set qilamiz
    }

    setPreviousPosition({
      latitude,
      longitude,
      time: currentTime
    })

    setStatus("Geo-lokatsiya ma'lumotlari olindi!")
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Yer radiusi (metrda)
    const toRad = deg => (deg * Math.PI) / 180

    const φ1 = toRad(lat1)
    const φ2 = toRad(lat2)
    const Δφ = toRad(lat2 - lat1)
    const Δλ = toRad(lon2 - lon1)

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Masofa metrda
  }

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1>Speed Tracker</h1>
      <p>Bu dastur sizning yurish tezligingizni o'lchaydi.</p>
      <div id='status' style={{ fontSize: '1.2em', color: 'green' }}>
        {status}
      </div>
      <div id='speed'>Tezlik: {speed} km/soat</div>
    </div>
  )
}

export default App
