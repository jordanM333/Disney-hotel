import Foundation

final class DiscountService {
    // Augments hotels with discount information.
    // Sources: AAA, AARP, military, hotel loyalty, booking site promos.
    func applyDiscounts(to hotels: [Hotel]) -> [Hotel] {
        hotels.map { hotel in
            var updated = hotel
            // Only add deals when the hotel has none (i.e., live data may already provide deals)
            if updated.deals.isEmpty {
                updated.deals = buildDeals(for: hotel)
            }
            return updated
        }
    }

    private func buildDeals(for hotel: Hotel) -> [HotelDeal] {
        var deals: [HotelDeal] = []

        // AAA discount: most Anaheim hotels honour ~10%
        deals.append(HotelDeal(
            title: "AAA Member Rate",
            description: "Show your AAA card at check-in for up to 10% off.",
            discountPercentage: 10,
            source: .aaa
        ))

        // AARP for value-tier hotels
        if hotel.priceLevel <= 2 {
            deals.append(HotelDeal(
                title: "AARP Senior Discount",
                description: "AARP members 50+ save up to 10% on the best available rate.",
                discountPercentage: 10,
                source: .aarp
            ))
        }

        // Military rate
        deals.append(HotelDeal(
            title: "Military Appreciation",
            description: "Active-duty, veterans, and first responders — mention at booking.",
            discountPercentage: 10,
            promoCode: "MILITARY10",
            source: .military
        ))

        // Booking.com Genius
        deals.append(HotelDeal(
            title: "Booking.com Genius Deal",
            description: "Booking Genius members unlock secret prices on this property.",
            discountPercentage: 10,
            source: .bookingcom
        ))

        // Hotels.com rewards
        deals.append(HotelDeal(
            title: "Hotels.com Rewards Night",
            description: "Collect stamps toward a free night with Hotels.com One Key.",
            source: .hotelscom
        ))

        // Costco Travel for mid-to-upper hotels
        if hotel.priceLevel >= 2 {
            deals.append(HotelDeal(
                title: "Costco Travel Exclusive",
                description: "Costco members may save 10–15% plus receive hotel credit.",
                discountPercentage: 12,
                source: .costco
            ))
        }

        return deals
    }
}
