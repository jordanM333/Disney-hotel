import SwiftUI

struct FavoritesView: View {
    @ObservedObject var viewModel: HotelSearchViewModel
    @State private var selectedHotel: Hotel?

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.favoritedHotels.isEmpty {
                    emptyState
                } else {
                    list
                }
            }
            .navigationTitle("Saved Hotels")
            .navigationDestination(item: $selectedHotel) { hotel in
                HotelDetailView(hotel: hotel) {
                    viewModel.toggleFavorite(hotel)
                }
            }
        }
    }

    private var list: some View {
        ScrollView {
            LazyVStack(spacing: 14) {
                ForEach(viewModel.favoritedHotels) { hotel in
                    Button {
                        selectedHotel = hotel
                    } label: {
                        HotelCardView(hotel: hotel) {
                            viewModel.toggleFavorite(hotel)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "heart.slash")
                .font(.system(size: 60))
                .foregroundStyle(.secondary.opacity(0.5))
            Text("No Saved Hotels")
                .font(.title3.weight(.semibold))
            Text("Tap the heart on any hotel card to save it here for quick comparison.")
                .multilineTextAlignment(.center)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
