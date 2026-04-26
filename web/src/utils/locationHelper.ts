import { DISNEYLAND } from './constants'

export function distanceInMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg: number) { return (deg * Math.PI) / 180 }

export function distanceFromDisneyland(lat: number, lng: number): number {
  return distanceInMiles(lat, lng, DISNEYLAND.lat, DISNEYLAND.lng)
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) return `${Math.round(miles * 5280)} ft`
  return `${miles.toFixed(2)} mi`
}

export function walkingMinutes(miles: number): number {
  return Math.round((miles / 3.0) * 60)
}
