import Foundation
import CoreLocation

enum Constants {
    enum Disneyland {
        static let coordinate = CLLocationCoordinate2D(latitude: 33.8121, longitude: -117.9190)
        static let radiusInMeters: Double = 1609.34
        static let radiusInMiles: Double = 1.0
        static let address = "1313 Disneyland Dr, Anaheim, CA 92802"
    }

    enum API {
        static var googlePlacesKey: String {
            UserDefaults.standard.string(forKey: "google_places_api_key") ?? ""
        }
        static let googlePlacesBase = "https://maps.googleapis.com/maps/api/place"
    }

    enum Booking {
        static func hotelscom(checkIn: Date, checkOut: Date, adults: Int, children: Int) -> URL? {
            let fmt = iso
            let ci = fmt.string(from: checkIn)
            let co = fmt.string(from: checkOut)
            return URL(string: "https://www.hotels.com/search.do?q-destination=Anaheim%2C+CA&q-check-in=\(ci)&q-check-out=\(co)&q-rooms=1&q-room-0-adults=\(adults)&q-room-0-children=\(children)")
        }

        static func bookingCom(checkIn: Date, checkOut: Date, adults: Int, children: Int) -> URL? {
            let fmt = iso
            let ci = fmt.string(from: checkIn)
            let co = fmt.string(from: checkOut)
            return URL(string: "https://www.booking.com/searchresults.html?ss=Anaheim%2C+CA&checkin=\(ci)&checkout=\(co)&group_adults=\(adults)&group_children=\(children)&no_rooms=1&radius=2&unit=mi")
        }

        static func expedia(checkIn: Date, checkOut: Date, adults: Int, children: Int) -> URL? {
            let fmt = DateFormatter()
            fmt.dateFormat = "MM/dd/yyyy"
            guard
                let ci = fmt.string(for: checkIn)?.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
                let co = fmt.string(for: checkOut)?.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
            else { return nil }
            return URL(string: "https://www.expedia.com/Hotel-Search?destination=Disneyland+Anaheim&startDate=\(ci)&endDate=\(co)&adults=\(adults)&children=\(children)")
        }

        static func googleHotels(name: String, checkIn: Date, checkOut: Date) -> URL? {
            let fmt = iso
            let ci = fmt.string(from: checkIn)
            let co = fmt.string(from: checkOut)
            let encoded = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name
            return URL(string: "https://www.google.com/travel/hotels/s/\(encoded)?checkin=\(ci)&checkout=\(co)")
        }

        private static var iso: DateFormatter {
            let f = DateFormatter()
            f.dateFormat = "yyyy-MM-dd"
            return f
        }
    }
}
