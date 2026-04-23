import Foundation

struct SearchParameters: Equatable {
    var checkIn: Date
    var checkOut: Date
    var adults: Int
    var children: Int
    var sortBy: SortOption
    var maxPricePerNight: Double
    var minRating: Double

    var nights: Int {
        max(1, Calendar.current.dateComponents([.day], from: checkIn, to: checkOut).day ?? 1)
    }

    var guestSummary: String {
        var parts = ["\(adults) adult\(adults == 1 ? "" : "s")"]
        if children > 0 { parts.append("\(children) child\(children == 1 ? "" : "ren")") }
        return parts.joined(separator: ", ")
    }

    var nightSummary: String {
        "\(nights) night\(nights == 1 ? "" : "s")"
    }

    static var `default`: SearchParameters {
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
        let dayAfter  = Calendar.current.date(byAdding: .day, value: 2, to: Date()) ?? Date()
        return SearchParameters(
            checkIn:  tomorrow,
            checkOut: dayAfter,
            adults:   2,
            children: 0,
            sortBy:   .bestValue,
            maxPricePerNight: 500,
            minRating: 0
        )
    }

    enum SortOption: String, CaseIterable, Identifiable {
        case bestValue    = "Best Value"
        case lowestPrice  = "Lowest Price"
        case highestPrice = "Highest Price"
        case topRated     = "Top Rated"
        case closest      = "Closest"
        case mostDeals    = "Most Deals"

        var id: String { rawValue }

        var sfSymbol: String {
            switch self {
            case .bestValue:    return "star.circle.fill"
            case .lowestPrice:  return "arrow.down.circle.fill"
            case .highestPrice: return "arrow.up.circle.fill"
            case .topRated:     return "heart.fill"
            case .closest:      return "location.fill"
            case .mostDeals:    return "tag.fill"
            }
        }
    }
}
