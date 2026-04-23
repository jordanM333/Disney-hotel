import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = HotelSearchViewModel()

    var body: some View {
        TabView {
            SearchView(viewModel: viewModel)
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }

            HotelListView(viewModel: viewModel)
                .tabItem {
                    Label("Results", systemImage: "list.star")
                }
                .badge(viewModel.sortedHotels.isEmpty ? nil : "\(viewModel.sortedHotels.count)")

            FavoritesView(viewModel: viewModel)
                .tabItem {
                    Label("Saved", systemImage: "heart.fill")
                }
                .badge(viewModel.favoritedHotels.isEmpty ? nil : "\(viewModel.favoritedHotels.count)")
        }
    }
}
