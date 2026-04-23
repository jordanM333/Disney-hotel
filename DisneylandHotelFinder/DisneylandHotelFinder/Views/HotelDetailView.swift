import SwiftUI

struct HotelDetailView: View {
    let hotel: Hotel
    var onFavorite: (() -> Void)?

    @State private var showBookingSheet = false
    @Environment(\.openURL) private var openURL

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                // Hero photo
                heroImage
                    .frame(maxWidth: .infinity)
                    .frame(height: 260)
                    .clipped()

                VStack(alignment: .leading, spacing: 20) {
                    // Name + rating + price
                    headerSection

                    Divider()

                    // Distance / location
                    locationSection

                    Divider()

                    // Deals & discounts
                    if !hotel.deals.isEmpty {
                        dealsSection
                        Divider()
                    }

                    // Amenities
                    if !hotel.amenities.isEmpty {
                        amenitiesSection
                        Divider()
                    }

                    // Book buttons
                    bookingSection
                }
                .padding(20)
            }
        }
        .navigationTitle(hotel.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    onFavorite?()
                } label: {
                    Image(systemName: hotel.isFavorite ? "heart.fill" : "heart")
                        .foregroundStyle(hotel.isFavorite ? .red : .primary)
                }
            }
        }
        .sheet(isPresented: $showBookingSheet) {
            bookingSheet
        }
    }

    // MARK: - Sections

    @ViewBuilder
    private var heroImage: some View {
        if let url = hotel.photoURL {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let img): img.resizable().scaledToFill()
                case .failure: placeholder
                default: Color.gray.opacity(0.2).overlay(ProgressView())
                }
            }
        } else {
            placeholder
        }
    }

    private var placeholder: some View {
        LinearGradient(
            colors: [.blue.opacity(0.5), .indigo.opacity(0.9)],
            startPoint: .topLeading, endPoint: .bottomTrailing
        )
        .overlay(
            Image(systemName: "building.2.fill")
                .font(.system(size: 72))
                .foregroundStyle(.white.opacity(0.6))
        )
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(hotel.name)
                        .font(.title2.weight(.bold))
                    HStack(spacing: 6) {
                        ForEach(0..<5) { i in
                            Image(systemName: i < Int(hotel.rating.rounded()) ? "star.fill" : "star")
                                .font(.caption)
                                .foregroundStyle(.yellow)
                        }
                        Text(String(format: "%.1f", hotel.rating))
                            .font(.subheadline.weight(.semibold))
                        Text("(\(hotel.reviewCount.formatted()) reviews)")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    if let price = hotel.pricePerNight {
                        Text("$\(Int(price))")
                            .font(.title.weight(.bold))
                            .foregroundStyle(.blue)
                        Text("per night")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        if let total = hotel.totalPrice {
                            Text("$\(Int(total)) total")
                                .font(.footnote.weight(.medium))
                                .foregroundStyle(.secondary)
                        }
                    } else {
                        Text(hotel.estimatedPriceRange)
                            .font(.headline)
                            .foregroundStyle(.blue)
                        Text("est. / night")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            // Value score pill
            if hotel.valueScore > 0 {
                HStack(spacing: 6) {
                    Image(systemName: "chart.bar.fill")
                        .font(.caption)
                    Text("Value Score: \(Int(hotel.valueScore))/100")
                        .font(.caption.weight(.semibold))
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(valueScoreColor.opacity(0.15), in: Capsule())
                .foregroundStyle(valueScoreColor)
            }
        }
    }

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Location", systemImage: "map.fill")
                .font(.headline)

            HStack(spacing: 16) {
                infoTile(
                    icon: "location.fill",
                    value: LocationHelper.formattedDistance(hotel.distanceFromDisneyland),
                    label: "from Disneyland",
                    color: .blue
                )
                infoTile(
                    icon: "figure.walk",
                    value: "\(LocationHelper.walkingMinutes(hotel.distanceFromDisneyland)) min",
                    label: "walking",
                    color: .green
                )
                infoTile(
                    icon: "car.fill",
                    value: "2 min",
                    label: "by car",
                    color: .orange
                )
            }

            Text(hotel.address)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            if let mapsURL = URL(string: "maps://?daddr=\(hotel.latitude),\(hotel.longitude)") {
                Button {
                    openURL(mapsURL)
                } label: {
                    Label("Open in Maps", systemImage: "arrow.triangle.turn.up.right.diamond.fill")
                        .font(.subheadline.weight(.medium))
                }
                .foregroundStyle(.blue)
            }
        }
    }

    private var dealsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Deals & Discounts", systemImage: "tag.fill")
                .font(.headline)

            VStack(spacing: 8) {
                ForEach(hotel.deals) { deal in
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: deal.source.sfSymbol)
                            .font(.title3)
                            .foregroundStyle(.white)
                            .frame(width: 36, height: 36)
                            .background(.green, in: RoundedRectangle(cornerRadius: 8))

                        VStack(alignment: .leading, spacing: 3) {
                            HStack {
                                Text(deal.title)
                                    .font(.subheadline.weight(.semibold))
                                Spacer()
                                Text(deal.savingsLabel)
                                    .font(.caption.weight(.bold))
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 3)
                                    .background(.green.opacity(0.15), in: Capsule())
                                    .foregroundStyle(.green)
                            }
                            Text(deal.description)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            if let code = deal.promoCode {
                                HStack(spacing: 4) {
                                    Text("Code:")
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                    Text(code)
                                        .font(.caption.weight(.bold))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color(.systemGray5), in: RoundedRectangle(cornerRadius: 4))
                                        .foregroundStyle(.primary)
                                }
                            }
                        }
                    }
                    .padding(12)
                    .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 10))
                }
            }
        }
    }

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Amenities", systemImage: "sparkles")
                .font(.headline)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                ForEach(hotel.amenities, id: \.self) { amenity in
                    HStack(spacing: 6) {
                        Image(systemName: amenityIcon(amenity))
                            .font(.caption)
                            .foregroundStyle(.blue)
                            .frame(width: 18)
                        Text(amenity)
                            .font(.caption)
                            .lineLimit(1)
                        Spacer()
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 8))
                }
            }
        }
    }

    private var bookingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Book Your Stay", systemImage: "calendar.badge.checkmark")
                .font(.headline)

            // Booking summary
            if let ci = hotel.checkIn, let co = hotel.checkOut {
                let fmt = DateFormatter()
                let _ = { fmt.dateStyle = .medium; fmt.timeStyle = .none }()
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Check-in").font(.caption).foregroundStyle(.secondary)
                        Text(fmt.string(from: ci)).font(.subheadline.weight(.medium))
                    }
                    Spacer()
                    Image(systemName: "arrow.right")
                        .foregroundStyle(.secondary)
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("Check-out").font(.caption).foregroundStyle(.secondary)
                        Text(fmt.string(from: co)).font(.subheadline.weight(.medium))
                    }
                }
                .padding(12)
                .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 10))
            }

            // Primary CTA
            Button {
                showBookingSheet = true
            } label: {
                HStack {
                    Image(systemName: "calendar.badge.plus")
                    Text("Choose Booking Platform")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(.blue, in: RoundedRectangle(cornerRadius: 12))
                .foregroundStyle(.white)
            }

            if let website = hotel.websiteURL {
                Button {
                    openURL(website)
                } label: {
                    HStack {
                        Image(systemName: "house.fill")
                        Text("Visit Hotel Website")
                            .fontWeight(.medium)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(.blue, lineWidth: 1.5)
                    )
                    .foregroundStyle(.blue)
                }
            }
        }
    }

    private var bookingSheet: some View {
        NavigationStack {
            List(Hotel.BookingPlatform.allCases, id: \.self) { platform in
                if let url = hotel.bookingURL(platform: platform) {
                    Button {
                        openURL(url)
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: platform.sfSymbol)
                                .font(.title3)
                                .foregroundStyle(.white)
                                .frame(width: 40, height: 40)
                                .background(.blue, in: RoundedRectangle(cornerRadius: 10))
                            VStack(alignment: .leading, spacing: 2) {
                                Text(platform.rawValue)
                                    .font(.headline)
                                    .foregroundStyle(.primary)
                                Text("Search availability & prices")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: "arrow.up.right")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Book on...")
            .navigationBarTitleDisplayMode(.inline)
            .presentationDetents([.medium])
        }
    }

    // MARK: - Helpers

    private var valueScoreColor: Color {
        switch hotel.valueScore {
        case 75...: return .green
        case 50..<75: return .orange
        default: return .red
        }
    }

    private func infoTile(icon: String, value: String, label: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(color)
            Text(value)
                .font(.subheadline.weight(.bold))
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(color.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
    }

    private func amenityIcon(_ amenity: String) -> String {
        let lower = amenity.lowercased()
        if lower.contains("pool")         { return "figure.pool.swim" }
        if lower.contains("spa")          { return "sparkles" }
        if lower.contains("restaurant")   { return "fork.knife" }
        if lower.contains("gym") || lower.contains("fitness") { return "dumbbell.fill" }
        if lower.contains("parking")      { return "parkingsign" }
        if lower.contains("shuttle")      { return "bus.fill" }
        if lower.contains("breakfast")    { return "cup.and.saucer.fill" }
        if lower.contains("wifi")         { return "wifi" }
        if lower.contains("bar")          { return "wineglass.fill" }
        if lower.contains("concierge")    { return "person.badge.shield.checkmark" }
        if lower.contains("room service") { return "tray.and.arrow.up.fill" }
        return "checkmark.circle.fill"
    }
}
