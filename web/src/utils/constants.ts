export const DISNEYLAND = {
  lat: 33.8121,
  lng: -117.9190,
  radiusMiles: 1.0,
  radiusMeters: 1609.34,
  address: '1313 Disneyland Dr, Anaheim, CA 92802',
}

export function buildHotelsComURL(checkIn: string, checkOut: string, adults: number, children: number) {
  return `https://www.hotels.com/search.do?q-destination=Anaheim%2C+CA&q-check-in=${checkIn}&q-check-out=${checkOut}&q-rooms=1&q-room-0-adults=${adults}&q-room-0-children=${children}`
}

export function buildBookingComURL(checkIn: string, checkOut: string, adults: number, children: number) {
  return `https://www.booking.com/searchresults.html?ss=Anaheim%2C+CA&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=1`
}

export function buildExpediaURL(checkIn: string, checkOut: string, adults: number, children: number) {
  const ci = checkIn.replace(/-/g, '/').split('/').map((p, i) => (i === 0 ? p : p.padStart(2, '0'))).join('/')
  const co = checkOut.replace(/-/g, '/').split('/').map((p, i) => (i === 0 ? p : p.padStart(2, '0'))).join('/')
  return `https://www.expedia.com/Hotel-Search?destination=Disneyland+Anaheim&startDate=${ci}&endDate=${co}&adults=${adults}&children=${children}`
}

export function buildGoogleHotelsURL(hotelName: string, checkIn: string, checkOut: string) {
  const encoded = encodeURIComponent(hotelName + ' Anaheim CA')
  return `https://www.google.com/travel/hotels/s/${encoded}?checkin=${checkIn}&checkout=${checkOut}`
}

export function buildBookingComHotelURL(hotelName: string, checkIn: string, checkOut: string, adults: number, children: number) {
  const q = encodeURIComponent(hotelName)
  return `https://www.booking.com/search.html?ss=${q}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=1`
}

export function buildHotelsComHotelURL(hotelName: string, checkIn: string, checkOut: string, adults: number, children: number) {
  const q = encodeURIComponent(hotelName + ' Anaheim CA')
  return `https://www.hotels.com/search.do?q-destination=${q}&q-check-in=${checkIn}&q-check-out=${checkOut}&q-rooms=1&q-room-0-adults=${adults}&q-room-0-children=${children}`
}

export function buildExpediaHotelURL(hotelName: string, checkIn: string, checkOut: string, adults: number, children: number) {
  const q = encodeURIComponent(hotelName + ' Anaheim CA')
  const ci = checkIn.replace(/-/g, '/').split('/').map((p, i) => (i === 0 ? p : p.padStart(2, '0'))).join('/')
  const co = checkOut.replace(/-/g, '/').split('/').map((p, i) => (i === 0 ? p : p.padStart(2, '0'))).join('/')
  return `https://www.expedia.com/Hotel-Search?destination=${q}&startDate=${ci}&endDate=${co}&adults=${adults}&children=${children}`
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000)
  return Math.max(1, diff)
}

export function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function dayAfterTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  return d.toISOString().slice(0, 10)
}
