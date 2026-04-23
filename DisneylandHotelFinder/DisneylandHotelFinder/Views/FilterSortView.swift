import SwiftUI

struct FilterSortView: View {
    @Binding var params: SearchParameters
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Sort By") {
                    Picker("Sort", selection: $params.sortBy) {
                        ForEach(SearchParameters.SortOption.allCases) { option in
                            Label(option.rawValue, systemImage: option.sfSymbol)
                                .tag(option)
                        }
                    }
                    .pickerStyle(.inline)
                    .labelsHidden()
                }

                Section("Max Price / Night") {
                    HStack {
                        Text("$\(Int(params.maxPricePerNight))")
                            .font(.headline)
                            .monospacedDigit()
                            .frame(width: 60, alignment: .leading)
                        Slider(value: $params.maxPricePerNight, in: 50...800, step: 25)
                            .tint(.blue)
                    }
                }

                Section("Min Rating") {
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                        Text(String(format: "%.1f+", params.minRating))
                            .font(.headline)
                            .monospacedDigit()
                            .frame(width: 44, alignment: .leading)
                        Slider(value: $params.minRating, in: 0...5, step: 0.5)
                            .tint(.yellow)
                    }
                }
            }
            .navigationTitle("Filter & Sort")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .fontWeight(.semibold)
                }
                ToolbarItem(placement: .topBarLeading) {
                    Button("Reset") {
                        params.sortBy = .bestValue
                        params.maxPricePerNight = 500
                        params.minRating = 0
                    }
                    .foregroundStyle(.red)
                }
            }
        }
    }
}
