import SwiftUI

struct HotelCardView: View {
    let hotel: Hotel
    var onFavorite: (() -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Photo header
            ZStack(alignment: .topTrailing) {
                photoView
                    .frame(height: 160)
                    .clipped()

                // Favorite button
                Button {
                    onFavorite?()
                } label: {
                    Image(systemName: hotel.isFavorite ? "heart.fill" : "heart")
                        .font(.title3)
                        .foregroundStyle(hotel.isFavorite ? .red : .white)
                        .padding(8)
                        .background(.ultraThinMaterial, in: Circle())
                }
                .padding(10)

                // Value badge
                if hotel.valueScore > 70 {
                    valueBadge
                        .padding([.bottom, .leading], 10)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                }
            }

            // Info
            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .top) {
                    Text(hotel.name)
                        .font(.headline)
                        .lineLimit(2)
                    Spacer()
                    priceView
                }

                HStack(spacing: 12) {
                    ratingBadge
                    distanceBadge
                    if !hotel.priceLevelDisplay.isEmpty {
                        Text(hotel.priceLevelDisplay)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }

                if !hotel.deals.isEmpty {
                    dealsBadgeRow
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
        }
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 2)
    }

    // MARK: - Sub-views
    @ViewBuilder
    private var photoView: some View {
        if let url = hotel.photoURL {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image.resizable().scaledToFill()
                case .failure:
                    placeholderImage
                default:
                    Color.gray.opacity(0.15).overlay(ProgressView())
                }
            }
        } else {
            placeholderImage
        }
    }

    private var placeholderImage: some View {
        LinearGradient(
            colors: [Color.blue.opacity(0.6), Color.indigo.opacity(0.8)],
            startPoint: .topLeading, endPoint: .bottomTrailing
        )
        .overlay(
            Image(systemName: "building.2.fill")
                .font(.system(size: 48))
                .foregroundStyle(.white.opacity(0.7))
        )
    }

    private var valueBadge: some View {
        HStack(spacing: 4) {
            Image(systemName: "star.circle.fill")
            Text("Best Value")
        }
        .font(.caption2.weight(.semibold))
        .foregroundStyle(.white)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(.blue, in: Capsule())
    }

    private var priceView: some View {
        VStack(alignment: .trailing, spacing: 2) {
            if let price = hotel.pricePerNight {
                Text("$\(Int(price))")
                    .font(.title3.weight(.bold))
                    .foregroundStyle(.primary)
                Text("/ night")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            } else {
                Text(hotel.estimatedPriceRange)
                    .font(.callout.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var ratingBadge: some View {
        HStack(spacing: 3) {
            Image(systemName: "star.fill")
                .font(.caption2)
                .foregroundStyle(.yellow)
            Text(String(format: "%.1f", hotel.rating))
                .font(.caption.weight(.semibold))
            Text("(\(hotel.reviewCount.formatted()))")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }

    private var distanceBadge: some View {
        HStack(spacing: 3) {
            Image(systemName: "figure.walk")
                .font(.caption2)
                .foregroundStyle(.green)
            Text(LocationHelper.formattedDistance(hotel.distanceFromDisneyland))
                .font(.caption.weight(.medium))
            Text("· \(LocationHelper.walkingMinutes(hotel.distanceFromDisneyland)) min walk")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }

    private var dealsBadgeRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(hotel.deals.prefix(3)) { deal in
                    HStack(spacing: 3) {
                        Image(systemName: "tag.fill")
                            .font(.system(size: 8))
                        Text(deal.savingsLabel)
                            .font(.caption2.weight(.semibold))
                        Text("· \(deal.source.rawValue)")
                            .font(.caption2)
                    }
                    .padding(.horizontal, 7)
                    .padding(.vertical, 3)
                    .background(Color.green.opacity(0.12), in: Capsule())
                    .foregroundStyle(.green)
                }
                if hotel.deals.count > 3 {
                    Text("+\(hotel.deals.count - 3) more")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .padding(.leading, 2)
                }
            }
        }
    }
}
