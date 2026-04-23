import Foundation

struct HotelDeal: Identifiable, Codable, Equatable, Hashable {
    let id: UUID
    let title: String
    let description: String
    let discountPercentage: Double?
    let discountAmount: Double?
    let promoCode: String?
    let source: DealSource
    let expiryDate: Date?
    let isVerified: Bool

    init(
        id: UUID = UUID(),
        title: String,
        description: String,
        discountPercentage: Double? = nil,
        discountAmount: Double? = nil,
        promoCode: String? = nil,
        source: DealSource,
        expiryDate: Date? = nil,
        isVerified: Bool = true
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.discountPercentage = discountPercentage
        self.discountAmount = discountAmount
        self.promoCode = promoCode
        self.source = source
        self.expiryDate = expiryDate
        self.isVerified = isVerified
    }

    enum DealSource: String, Codable, CaseIterable {
        case aaa = "AAA"
        case aarp = "AARP"
        case military = "Military"
        case costco = "Costco Travel"
        case hotelscom = "Hotels.com"
        case bookingcom = "Booking.com"
        case expedia = "Expedia"
        case direct = "Direct"
        case other = "Other"

        var sfSymbol: String {
            switch self {
            case .aaa:       return "car.fill"
            case .aarp:      return "person.2.fill"
            case .military:  return "shield.fill"
            case .costco:    return "cart.fill"
            case .hotelscom: return "building.fill"
            case .bookingcom:return "globe"
            case .expedia:   return "airplane"
            case .direct:    return "house.fill"
            case .other:     return "tag.fill"
            }
        }

        var color: String {
            switch self {
            case .aaa:       return "blue"
            case .aarp:      return "purple"
            case .military:  return "green"
            case .costco:    return "red"
            case .hotelscom: return "orange"
            case .bookingcom:return "teal"
            case .expedia:   return "yellow"
            case .direct:    return "indigo"
            case .other:     return "gray"
            }
        }
    }

    var savingsLabel: String {
        if let pct = discountPercentage {
            return "\(Int(pct))% off"
        } else if let amt = discountAmount {
            return "$\(Int(amt)) off"
        }
        return "Special Rate"
    }
}
