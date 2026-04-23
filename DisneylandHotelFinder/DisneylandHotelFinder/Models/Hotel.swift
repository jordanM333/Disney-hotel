import Foundation
import CoreLocation

struct Hotel: Identifiable, Codable, Equatable {
    let id: String
    let placeID: String
    let name: String
    let address: String
    let latitude: Double
    let longitude: Double
    let rating: Double
    let reviewCount: Int
    let priceLevel: Int
    let photoReference: String?

    var pricePerNight: Double?
    var totalPrice: Double?
    var deals: [HotelDeal]
    var websiteURL: URL?
    var phoneNumber: String?
    var amenities: [String]
    var isFavorite: Bool
    var checkIn: Date?
    var checkOut: Date?
    var adults: Int
    var children: Int

    init(
        id: String = UUID().uuidString,
        placeID: String,
        name: String,
        address: String,
        latitude: Double,
        longitude: Double,
        rating: Double,
        reviewCount: Int,
        priceLevel: Int,
        photoReference: String? = nil,
        pricePerNight: Double? = nil,
        totalPrice: Double? = nil,
        deals: [HotelDeal] = [],
        websiteURL: URL? = nil,
        phoneNumber: String? = nil,
        amenities: [String] = [],
        isFavorite: Bool = false,
        checkIn: Date? = nil,
        checkOut: Date? = nil,
        adults: Int = 2,
        children: Int = 0
    ) {
        self.id = id
        self.placeID = placeID
        self.name = name
        self.address = address
        self.latitude = latitude
        self.longitude = longitude
        self.rating = rating
        self.reviewCount = reviewCount
        self.priceLevel = priceLevel
        self.photoReference = photoReference
        self.pricePerNight = pricePerNight
        self.totalPrice = totalPrice
        self.deals = deals
        self.websiteURL = websiteURL
        self.phoneNumber = phoneNumber
        self.amenities = amenities
        self.isFavorite = isFavorite
        self.checkIn = checkIn
        self.checkOut = checkOut
        self.adults = adults
        self.children = children
    }

    var distanceFromDisneyland: Double {
        LocationHelper.distanceFromDisneyland(latitude: latitude, longitude: longitude)
    }

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }

    var valueScore: Double {
        guard let price = pricePerNight, price > 0 else { return 0 }
        let ratingFactor    = rating / 5.0
        let priceFactor     = max(0.0, 1.0 - (price / 450.0))
        let discountFactor  = min(Double(deals.count) * 0.08, 0.24)
        let distanceFactor  = max(0.0, 1.0 - distanceFromDisneyland)
        return (ratingFactor * 0.35 + priceFactor * 0.40 + discountFactor * 0.10 + distanceFactor * 0.15) * 100
    }

    var priceLevelDisplay: String {
        guard priceLevel > 0 else { return "" }
        return String(repeating: "$", count: priceLevel)
    }

    var estimatedPriceRange: String {
        switch priceLevel {
        case 1: return "$80 – $130"
        case 2: return "$130 – $220"
        case 3: return "$220 – $350"
        case 4: return "$350+"
        default: return "Price varies"
        }
    }

    var photoURL: URL? {
        guard let ref = photoReference, !Constants.API.googlePlacesKey.isEmpty else { return nil }
        return URL(string: "\(Constants.API.googlePlacesBase)/photo?maxwidth=600&photo_reference=\(ref)&key=\(Constants.API.googlePlacesKey)")
    }

    var nightsCount: Int {
        guard let ci = checkIn, let co = checkOut else { return 1 }
        return max(1, Calendar.current.dateComponents([.day], from: ci, to: co).day ?? 1)
    }

    func bookingURL(platform: BookingPlatform) -> URL? {
        let ci = checkIn ?? Date()
        let co = checkOut ?? Calendar.current.date(byAdding: .day, value: 1, to: ci) ?? ci
        switch platform {
        case .hotelscom:  return Constants.Booking.hotelscom(checkIn: ci, checkOut: co, adults: adults, children: children)
        case .bookingcom: return Constants.Booking.bookingCom(checkIn: ci, checkOut: co, adults: adults, children: children)
        case .expedia:    return Constants.Booking.expedia(checkIn: ci, checkOut: co, adults: adults, children: children)
        case .google:     return Constants.Booking.googleHotels(name: name, checkIn: ci, checkOut: co)
        case .direct:     return websiteURL
        }
    }

    enum BookingPlatform: String, CaseIterable {
        case hotelscom  = "Hotels.com"
        case bookingcom = "Booking.com"
        case expedia    = "Expedia"
        case google     = "Google Hotels"
        case direct     = "Hotel Website"

        var sfSymbol: String {
            switch self {
            case .hotelscom:  return "building.2.fill"
            case .bookingcom: return "globe"
            case .expedia:    return "airplane"
            case .google:     return "magnifyingglass"
            case .direct:     return "house.fill"
            }
        }
    }
}

// MARK: - Mock data
extension Hotel {
    static var mockHotels: [Hotel] {
        [
            Hotel(
                placeID: "mock_disneyland_hotel",
                name: "Disneyland Hotel",
                address: "1150 Magic Way, Anaheim, CA 92802",
                latitude: 33.8090, longitude: -117.9234,
                rating: 4.6, reviewCount: 18_450,
                priceLevel: 4,
                pricePerNight: 389,
                deals: [
                    HotelDeal(title: "Magic Ticket Package", description: "Save up to 25% when bundling park tickets", discountPercentage: 25, source: .direct),
                    HotelDeal(title: "AAA Discount", description: "AAA members save 10%", discountPercentage: 10, promoCode: "AAA10", source: .aaa)
                ],
                websiteURL: URL(string: "https://disneyland.disney.go.com/hotels/disneyland-hotel/"),
                amenities: ["Pool", "Spa", "Restaurant", "Room Service", "Fitness Center", "Character Dining", "Early Park Access", "Monorail Access"]
            ),
            Hotel(
                placeID: "mock_grand_californian",
                name: "Disney's Grand Californian Hotel & Spa",
                address: "1600 S Disneyland Dr, Anaheim, CA 92802",
                latitude: 33.8099, longitude: -117.9194,
                rating: 4.8, reviewCount: 12_830,
                priceLevel: 4,
                pricePerNight: 649,
                deals: [
                    HotelDeal(title: "Stay More Save More", description: "Book 3+ nights and save 20%", discountPercentage: 20, source: .direct),
                    HotelDeal(title: "AAA Member Rate", description: "Up to 15% off for AAA members", discountPercentage: 15, promoCode: "AAA15", source: .aaa)
                ],
                websiteURL: URL(string: "https://disneyland.disney.go.com/hotels/grand-californian-hotel/"),
                amenities: ["Spa", "3 Pools", "5 Restaurants", "Direct Park Access", "Concierge", "Early Park Entry", "Fitness Center", "Character Dining"]
            ),
            Hotel(
                placeID: "mock_candy_cane_inn",
                name: "Candy Cane Inn",
                address: "1747 S Harbor Blvd, Anaheim, CA 92802",
                latitude: 33.8046, longitude: -117.9210,
                rating: 4.5, reviewCount: 6_742,
                priceLevel: 2,
                pricePerNight: 149,
                deals: [
                    HotelDeal(title: "AAA Rate", description: "10% off for AAA members", discountPercentage: 10, source: .aaa),
                    HotelDeal(title: "Book Direct Save 5%", description: "Save 5% booking direct", discountPercentage: 5, source: .direct)
                ],
                websiteURL: URL(string: "https://www.candycaneinn.net/"),
                amenities: ["Pool", "Free Breakfast", "Free Parking", "Shuttle to Disneyland", "Fitness Center"]
            ),
            Hotel(
                placeID: "mock_howard_johnson",
                name: "Howard Johnson by Wyndham Anaheim Hotel & Water Playground",
                address: "1380 S Harbor Blvd, Anaheim, CA 92802",
                latitude: 33.8102, longitude: -117.9212,
                rating: 4.1, reviewCount: 5_320,
                priceLevel: 2,
                pricePerNight: 129,
                deals: [
                    HotelDeal(title: "Wyndham Rewards", description: "Earn points on every stay", source: .direct),
                    HotelDeal(title: "AAA Savings", description: "15% discount for AAA members", discountPercentage: 15, source: .aaa),
                    HotelDeal(title: "Military Rate", description: "Verified military save 10%", discountPercentage: 10, source: .military)
                ],
                websiteURL: URL(string: "https://www.hojo.com/anaheim"),
                amenities: ["Water Playground", "Pool", "Free Parking", "Game Room", "Restaurant", "Shuttle to Disneyland"]
            ),
            Hotel(
                placeID: "mock_tropicana",
                name: "Tropicana Inn & Suites",
                address: "1540 S Harbor Blvd, Anaheim, CA 92802",
                latitude: 33.8061, longitude: -117.9212,
                rating: 4.0, reviewCount: 4_180,
                priceLevel: 2,
                pricePerNight: 119,
                deals: [
                    HotelDeal(title: "Early Bird Deal", description: "Book 30 days ahead & save 20%", discountPercentage: 20, source: .direct),
                    HotelDeal(title: "AAA Discount", description: "10% off for AAA members", discountPercentage: 10, source: .aaa)
                ],
                websiteURL: URL(string: "https://www.tropicanainn-anaheim.com/"),
                amenities: ["Pool", "Free Parking", "Walking Distance to Parks", "Continental Breakfast"]
            ),
            Hotel(
                placeID: "mock_anabella",
                name: "Anabella Hotel",
                address: "1030 W Katella Ave, Anaheim, CA 92802",
                latitude: 33.8030, longitude: -117.9198,
                rating: 4.2, reviewCount: 3_860,
                priceLevel: 2,
                pricePerNight: 139,
                deals: [
                    HotelDeal(title: "Expedia Deal", description: "Save 12% on Expedia", discountPercentage: 12, source: .expedia),
                    HotelDeal(title: "AARP Senior Rate", description: "AARP members save 10%", discountPercentage: 10, source: .aarp)
                ],
                websiteURL: URL(string: "https://www.anabellahotel.com/"),
                amenities: ["Pool", "Spa", "Restaurant", "Free Shuttle", "Fitness Center", "Business Center"]
            ),
            Hotel(
                placeID: "mock_desert_palms",
                name: "Desert Palms Hotel & Suites",
                address: "631 W Katella Ave, Anaheim, CA 92802",
                latitude: 33.8028, longitude: -117.9263,
                rating: 4.3, reviewCount: 4_590,
                priceLevel: 2,
                pricePerNight: 155,
                deals: [
                    HotelDeal(title: "Costco Travel Deal", description: "Save up to 15% via Costco Travel", discountPercentage: 15, source: .costco),
                    HotelDeal(title: "Family Package", description: "Kids eat free + pool access", source: .direct)
                ],
                websiteURL: URL(string: "https://www.desertpalmshotel.com/"),
                amenities: ["Pool", "Suites Available", "Kitchen Suites", "Free Breakfast", "Shuttle", "BBQ Area"]
            ),
            Hotel(
                placeID: "mock_park_vue",
                name: "Park Vue Inn",
                address: "1570 S Harbor Blvd, Anaheim, CA 92802",
                latitude: 33.8056, longitude: -117.9211,
                rating: 3.9, reviewCount: 2_120,
                priceLevel: 1,
                pricePerNight: 99,
                deals: [
                    HotelDeal(title: "Booking.com Genius", description: "Genius members get 10% off", discountPercentage: 10, source: .bookingcom),
                    HotelDeal(title: "Senior Discount", description: "AARP members save 10%", discountPercentage: 10, source: .aarp)
                ],
                websiteURL: URL(string: "https://www.parkvueinn.com/"),
                amenities: ["Pool", "Free Parking", "Walking Distance", "Microwave/Fridge in Rooms"]
            ),
            Hotel(
                placeID: "mock_carousel",
                name: "Carousel Inn & Suites",
                address: "1530 S Harbor Blvd, Anaheim, CA 92802",
                latitude: 33.8063, longitude: -117.9212,
                rating: 4.0, reviewCount: 2_870,
                priceLevel: 2,
                pricePerNight: 129,
                deals: [
                    HotelDeal(title: "Hotels.com Secret Price", description: "Members-only rate", discountPercentage: 8, source: .hotelscom),
                    HotelDeal(title: "Military Appreciation", description: "10% off for active/veteran military", discountPercentage: 10, promoCode: "MILITARY10", source: .military)
                ],
                websiteURL: URL(string: "https://www.carouselinnanaheim.com/"),
                amenities: ["Rooftop Pool", "Free Parking", "Sundeck", "Suites", "Free Shuttle"]
            ),
            Hotel(
                placeID: "mock_clarion",
                name: "Clarion Hotel Anaheim Resort",
                address: "616 Convention Way, Anaheim, CA 92802",
                latitude: 33.8020, longitude: -117.9237,
                rating: 3.8, reviewCount: 3_140,
                priceLevel: 2,
                pricePerNight: 115,
                deals: [
                    HotelDeal(title: "Choice Hotels Rate", description: "Save with Choice Privileges points", source: .direct),
                    HotelDeal(title: "AAA/CAA", description: "AAA members save 10%", discountPercentage: 10, source: .aaa),
                    HotelDeal(title: "Government/Military Rate", description: "Verified government/military save 15%", discountPercentage: 15, source: .military)
                ],
                websiteURL: URL(string: "https://www.clarionhotelanaheim.com/"),
                amenities: ["Pool", "Restaurant", "Fitness Center", "Business Center", "Free Parking", "Convention Access"]
            )
        ]
    }
}
