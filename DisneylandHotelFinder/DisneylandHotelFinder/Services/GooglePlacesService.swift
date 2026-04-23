import Foundation
import CoreLocation

final class GooglePlacesService {
    private let session = URLSession.shared

    // MARK: - Nearby hotel search
    func fetchNearbyHotels(params: SearchParameters) async throws -> [Hotel] {
        let apiKey = Constants.API.googlePlacesKey
        guard !apiKey.isEmpty else {
            return Hotel.mockHotels.map { applyParams($0, params: params) }
        }

        let coord = Constants.Disneyland.coordinate
        let urlString = "\(Constants.API.googlePlacesBase)/nearbysearch/json" +
            "?location=\(coord.latitude),\(coord.longitude)" +
            "&radius=\(Int(Constants.Disneyland.radiusInMeters))" +
            "&type=lodging" +
            "&key=\(apiKey)"

        guard let url = URL(string: urlString) else {
            throw ServiceError.invalidURL
        }

        let (data, response) = try await session.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw ServiceError.badResponse
        }

        let decoded = try JSONDecoder().decode(PlacesNearbyResponse.self, from: data)
        guard decoded.status == "OK" else {
            throw ServiceError.apiError(decoded.status)
        }

        var hotels = decoded.results.compactMap { place -> Hotel? in
            let dist = LocationHelper.distanceFromDisneyland(
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng
            )
            guard dist <= Constants.Disneyland.radiusInMiles else { return nil }
            return Hotel(
                placeID: place.place_id,
                name: place.name,
                address: place.vicinity ?? "",
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                rating: place.rating ?? 0,
                reviewCount: place.user_ratings_total ?? 0,
                priceLevel: place.price_level ?? 2,
                photoReference: place.photos?.first?.photo_reference,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                adults: params.adults,
                children: params.children
            )
        }

        // Fetch details for each hotel to get website/phone
        hotels = await withTaskGroup(of: Hotel.self) { group in
            for hotel in hotels {
                group.addTask { [weak self] in
                    guard let self else { return hotel }
                    return (try? await self.enrichWithDetails(hotel, apiKey: apiKey)) ?? hotel
                }
            }
            var enriched: [Hotel] = []
            for await h in group { enriched.append(h) }
            return enriched
        }

        return hotels
    }

    // MARK: - Details enrichment
    private func enrichWithDetails(_ hotel: Hotel, apiKey: String) async throws -> Hotel {
        let fields = "website,formatted_phone_number,price_level,opening_hours"
        let urlString = "\(Constants.API.googlePlacesBase)/details/json?place_id=\(hotel.placeID)&fields=\(fields)&key=\(apiKey)"
        guard let url = URL(string: urlString) else { return hotel }

        let (data, _) = try await session.data(from: url)
        let decoded = try JSONDecoder().decode(PlacesDetailsResponse.self, from: data)
        guard decoded.status == "OK", let result = decoded.result else { return hotel }

        var updated = hotel
        updated.websiteURL = result.website.flatMap(URL.init(string:))
        updated.phoneNumber = result.formatted_phone_number
        return updated
    }

    private func applyParams(_ hotel: Hotel, params: SearchParameters) -> Hotel {
        var h = hotel
        h.checkIn = params.checkIn
        h.checkOut = params.checkOut
        h.adults = params.adults
        h.children = params.children
        return h
    }

    // MARK: - Errors
    enum ServiceError: LocalizedError {
        case invalidURL
        case badResponse
        case apiError(String)

        var errorDescription: String? {
            switch self {
            case .invalidURL:       return "Invalid request URL."
            case .badResponse:      return "Server returned an error."
            case .apiError(let s):  return "API error: \(s)"
            }
        }
    }
}

// MARK: - Codable models for Google Places API
private struct PlacesNearbyResponse: Codable {
    let results: [PlaceResult]
    let status: String
}

private struct PlacesDetailsResponse: Codable {
    let result: PlaceDetail?
    let status: String
}

private struct PlaceResult: Codable {
    let place_id: String
    let name: String
    let vicinity: String?
    let geometry: Geometry
    let rating: Double?
    let user_ratings_total: Int?
    let price_level: Int?
    let photos: [Photo]?
}

private struct PlaceDetail: Codable {
    let website: String?
    let formatted_phone_number: String?
}

private struct Geometry: Codable {
    let location: LatLng
}

private struct LatLng: Codable {
    let lat: Double
    let lng: Double
}

private struct Photo: Codable {
    let photo_reference: String
    let height: Int
    let width: Int
}
