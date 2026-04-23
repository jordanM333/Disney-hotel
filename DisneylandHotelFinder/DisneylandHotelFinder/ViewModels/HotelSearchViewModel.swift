import Foundation
import Combine

@MainActor
final class HotelSearchViewModel: ObservableObject {
    @Published var hotels: [Hotel] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var params = SearchParameters.default
    @Published var favorites: Set<String> = []
    @Published var hasSearched = false

    private let placesService  = GooglePlacesService()
    private let pricingService = HotelPricingService()
    private let discountService = DiscountService()

    var sortedHotels: [Hotel] {
        let filtered = hotels.filter { hotel in
            let priceOK = hotel.pricePerNight.map { $0 <= params.maxPricePerNight } ?? true
            let ratingOK = hotel.rating >= params.minRating
            return priceOK && ratingOK
        }
        return filtered.sorted { a, b in
            switch params.sortBy {
            case .bestValue:    return a.valueScore > b.valueScore
            case .lowestPrice:  return (a.pricePerNight ?? .infinity) < (b.pricePerNight ?? .infinity)
            case .highestPrice: return (a.pricePerNight ?? 0) > (b.pricePerNight ?? 0)
            case .topRated:     return a.rating > b.rating
            case .closest:      return a.distanceFromDisneyland < b.distanceFromDisneyland
            case .mostDeals:    return a.deals.count > b.deals.count
            }
        }
    }

    func search() {
        guard !isLoading else { return }
        isLoading = true
        errorMessage = nil
        hasSearched = true
        hotels = []

        Task {
            do {
                var results = try await placesService.fetchNearbyHotels(params: params)
                results = await pricingService.applyPricing(to: results, params: params)
                results = discountService.applyDiscounts(to: results)
                results = results.map { h in
                    var updated = h
                    updated.isFavorite = favorites.contains(h.id)
                    return updated
                }
                hotels = results
            } catch {
                errorMessage = error.localizedDescription
            }
            isLoading = false
        }
    }

    func toggleFavorite(_ hotel: Hotel) {
        if favorites.contains(hotel.id) {
            favorites.remove(hotel.id)
        } else {
            favorites.insert(hotel.id)
        }
        // Sync state in list
        if let idx = hotels.firstIndex(where: { $0.id == hotel.id }) {
            hotels[idx].isFavorite = favorites.contains(hotel.id)
        }
    }

    var favoritedHotels: [Hotel] {
        hotels.filter { favorites.contains($0.id) }
    }

    // Cheapest per-night price in current results
    var lowestPrice: Double? {
        sortedHotels.compactMap(\.pricePerNight).min()
    }

    // Best value score label
    var bestValueHotelName: String? {
        sortedHotels.max(by: { $0.valueScore < $1.valueScore })?.name
    }
}
