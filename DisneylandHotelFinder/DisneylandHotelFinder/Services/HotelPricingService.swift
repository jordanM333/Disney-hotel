import Foundation

final class HotelPricingService {
    // Applies estimated pricing when live pricing APIs are unavailable.
    // For live pricing, integrate Hotels.com via RapidAPI (hotels4.p.rapidapi.com).
    func applyPricing(to hotels: [Hotel], params: SearchParameters) async -> [Hotel] {
        await withTaskGroup(of: Hotel.self) { group in
            for hotel in hotels {
                group.addTask {
                    var updated = hotel
                    if updated.pricePerNight == nil {
                        updated.pricePerNight = Self.estimatePrice(priceLevel: hotel.priceLevel, nights: params.nights)
                    }
                    updated.totalPrice = (updated.pricePerNight ?? 0) * Double(params.nights)
                    return updated
                }
            }
            var result: [Hotel] = []
            for await h in group { result.append(h) }
            return result
        }
    }

    // Estimate nightly price from Google Places price_level when no live data is available.
    private static func estimatePrice(priceLevel: Int, nights: Int) -> Double {
        let baseRanges: [Int: ClosedRange<Double>] = [
            1: 80...130,
            2: 130...220,
            3: 220...350,
            4: 350...600
        ]
        let range = baseRanges[priceLevel] ?? 130...220
        // Pick middle of range and add slight variance
        let mid = (range.lowerBound + range.upperBound) / 2
        let variance = Double.random(in: -20...20)
        return (mid + variance).rounded()
    }
}
