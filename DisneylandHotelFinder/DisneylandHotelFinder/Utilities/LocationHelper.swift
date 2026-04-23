import CoreLocation

enum LocationHelper {
    static func distanceInMiles(from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) -> Double {
        let a = CLLocation(latitude: from.latitude, longitude: from.longitude)
        let b = CLLocation(latitude: to.latitude, longitude: to.longitude)
        return a.distance(from: b) / 1609.34
    }

    static func distanceFromDisneyland(latitude: Double, longitude: Double) -> Double {
        distanceInMiles(
            from: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
            to: Constants.Disneyland.coordinate
        )
    }

    static func formattedDistance(_ miles: Double) -> String {
        if miles < 0.1 {
            let feet = Int(miles * 5280)
            return "\(feet) ft"
        }
        return String(format: "%.2f mi", miles)
    }

    static func walkingMinutes(_ miles: Double) -> Int {
        Int((miles / 3.0) * 60)
    }
}
