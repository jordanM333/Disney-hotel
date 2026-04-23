import SwiftUI

struct HotelListView: View {
    @ObservedObject var viewModel: HotelSearchViewModel
    @State private var showFilters = false
    @State private var selectedHotel: Hotel?

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if !viewModel.hasSearched {
                    emptySearchPrompt
                } else if viewModel.sortedHotels.isEmpty {
                    noResultsView
                } else {
                    hotelList
                }
            }
            .navigationTitle("Hotels Near Disneyland")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                if !viewModel.sortedHotels.isEmpty || viewModel.hasSearched {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            showFilters = true
                        } label: {
                            Label("Filter", systemImage: "slider.horizontal.3")
                        }
                    }
                }
            }
            .sheet(isPresented: $showFilters) {
                FilterSortView(params: $viewModel.params)
            }
            .navigationDestination(item: $selectedHotel) { hotel in
                HotelDetailView(hotel: hotel) {
                    viewModel.toggleFavorite(hotel)
                }
            }
        }
    }

    // MARK: - Sub-views

    private var hotelList: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                // Summary bar
                summaryBar

                // Sort pill
                sortPill

                // Cards
                LazyVStack(spacing: 14) {
                    ForEach(viewModel.sortedHotels) { hotel in
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
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 20)
        }
    }

    private var summaryBar: some View {
        HStack(spacing: 6) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.blue)
                .font(.caption)
            Text("\(viewModel.sortedHotels.count) hotels within 1 mile of Disneyland")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Spacer()
            if let lowest = viewModel.lowestPrice {
                Text("From $\(Int(lowest))/night")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.green)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 10))
        .padding(.top, 8)
    }

    private var sortPill: some View {
        HStack(spacing: 6) {
            Image(systemName: viewModel.params.sortBy.sfSymbol)
                .font(.caption)
            Text("Sorted by: \(viewModel.params.sortBy.rawValue)")
                .font(.caption.weight(.medium))
        }
        .foregroundStyle(.blue)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(.blue.opacity(0.08), in: Capsule())
    }

    private var loadingView: some View {
        VStack(spacing: 24) {
            ProgressView()
                .scaleEffect(1.4)
            Text("Searching hotels near Disneyland…")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var emptySearchPrompt: some View {
        VStack(spacing: 16) {
            Image(systemName: "building.2.crop.circle")
                .font(.system(size: 64))
                .foregroundStyle(.blue.opacity(0.6))
            Text("Find Your Perfect Stay")
                .font(.title3.weight(.semibold))
            Text("Enter your travel dates on the Search tab and tap Search to discover the best hotels within 1 mile of Disneyland.")
                .multilineTextAlignment(.center)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var noResultsView: some View {
        VStack(spacing: 16) {
            Image(systemName: "magnifyingglass.circle")
                .font(.system(size: 64))
                .foregroundStyle(.secondary)
            Text("No Hotels Found")
                .font(.title3.weight(.semibold))
            Text("Try adjusting your filters — raise the max price or lower the minimum rating.")
                .multilineTextAlignment(.center)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 32)
            Button("Reset Filters") {
                viewModel.params.maxPricePerNight = 500
                viewModel.params.minRating = 0
            }
            .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
