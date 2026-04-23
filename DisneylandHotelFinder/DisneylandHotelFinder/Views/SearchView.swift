import SwiftUI

struct SearchView: View {
    @ObservedObject var viewModel: HotelSearchViewModel
    @State private var showAPISetup = false

    private var dateRange: ClosedRange<Date> {
        let today = Calendar.current.startOfDay(for: Date())
        let future = Calendar.current.date(byAdding: .year, value: 2, to: today)!
        return today...future
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    heroHeader

                    VStack(spacing: 16) {
                        datesCard
                        guestsCard
                        searchButton
                        if !viewModel.isLoading, let err = viewModel.errorMessage {
                            errorBanner(err)
                        }
                    }
                    .padding(.horizontal, 20)
                }
                .padding(.bottom, 30)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showAPISetup = true
                    } label: {
                        Image(systemName: "gear")
                    }
                }
            }
            .sheet(isPresented: $showAPISetup) {
                APISetupView()
            }
        }
    }

    // MARK: - Sub-views

    private var heroHeader: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(
                colors: [Color(red: 0.05, green: 0.28, blue: 0.63), Color(red: 0.18, green: 0.53, blue: 0.96)],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
            .ignoresSafeArea(edges: .top)
            .frame(height: 200)

            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 8) {
                    Image(systemName: "star.circle.fill")
                        .font(.system(size: 32))
                        .foregroundStyle(.yellow)
                    Text("Disneyland\nHotel Finder")
                        .font(.title.weight(.bold))
                        .foregroundStyle(.white)
                }
                HStack(spacing: 4) {
                    Image(systemName: "location.fill")
                        .font(.caption)
                    Text("Hotels within 1 mile · Best value · Discounts included")
                        .font(.caption)
                }
                .foregroundStyle(.white.opacity(0.85))
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
    }

    private var datesCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            sectionHeader("Travel Dates", icon: "calendar")
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 6)

            Divider().padding(.horizontal, 16)

            dateRow(
                label: "Check-in",
                binding: Binding(
                    get: { viewModel.params.checkIn },
                    set: { newDate in
                        viewModel.params.checkIn = newDate
                        if newDate >= viewModel.params.checkOut {
                            viewModel.params.checkOut = Calendar.current.date(byAdding: .day, value: 1, to: newDate) ?? newDate
                        }
                    }
                ),
                range: dateRange
            )

            Divider().padding(.horizontal, 16)

            dateRow(
                label: "Check-out",
                binding: Binding(
                    get: { viewModel.params.checkOut },
                    set: { viewModel.params.checkOut = $0 }
                ),
                range: viewModel.params.checkIn...Calendar.current.date(byAdding: .year, value: 2, to: Date())!
            )

            Divider().padding(.horizontal, 16)

            HStack {
                Image(systemName: "moon.fill")
                    .foregroundStyle(.indigo)
                Text(viewModel.params.nightSummary)
                    .font(.subheadline.weight(.medium))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.06), radius: 4, y: 2)
    }

    private var guestsCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            sectionHeader("Guests", icon: "person.2.fill")
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 6)

            Divider().padding(.horizontal, 16)

            stepperRow(
                label: "Adults",
                subLabel: "Age 18+",
                value: Binding(
                    get: { viewModel.params.adults },
                    set: { viewModel.params.adults = $0 }
                ),
                range: 1...8
            )

            Divider().padding(.horizontal, 16)

            stepperRow(
                label: "Children",
                subLabel: "Age 0–17",
                value: Binding(
                    get: { viewModel.params.children },
                    set: { viewModel.params.children = $0 }
                ),
                range: 0...6
            )
        }
        .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.06), radius: 4, y: 2)
    }

    private var searchButton: some View {
        Button {
            viewModel.search()
        } label: {
            HStack(spacing: 10) {
                if viewModel.isLoading {
                    ProgressView().tint(.white)
                } else {
                    Image(systemName: "magnifyingglass")
                }
                Text(viewModel.isLoading ? "Searching…" : "Search Hotels")
                    .fontWeight(.semibold)
                    .font(.title3)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                LinearGradient(
                    colors: [Color(red: 0.05, green: 0.28, blue: 0.63), Color(red: 0.18, green: 0.53, blue: 0.96)],
                    startPoint: .leading, endPoint: .trailing
                ),
                in: RoundedRectangle(cornerRadius: 14)
            )
            .foregroundStyle(.white)
        }
        .disabled(viewModel.isLoading)
        .animation(.easeInOut(duration: 0.2), value: viewModel.isLoading)
    }

    private func errorBanner(_ message: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.red)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(.red)
        }
        .padding(12)
        .background(Color.red.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Reusable row components

    private func sectionHeader(_ title: String, icon: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundStyle(.blue)
            Text(title)
                .font(.headline)
        }
    }

    private func dateRow(label: String, binding: Binding<Date>, range: ClosedRange<Date>) -> some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .frame(width: 80, alignment: .leading)
            Spacer()
            DatePicker("", selection: binding, in: range, displayedComponents: .date)
                .labelsHidden()
                .datePickerStyle(.compact)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    private func stepperRow(label: String, subLabel: String, value: Binding<Int>, range: ClosedRange<Int>) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(label).font(.subheadline)
                Text(subLabel).font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            HStack(spacing: 14) {
                Button {
                    if value.wrappedValue > range.lowerBound { value.wrappedValue -= 1 }
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .font(.title2)
                        .foregroundStyle(value.wrappedValue > range.lowerBound ? .blue : .gray)
                }
                .disabled(value.wrappedValue <= range.lowerBound)

                Text("\(value.wrappedValue)")
                    .font(.headline)
                    .monospacedDigit()
                    .frame(width: 28)

                Button {
                    if value.wrappedValue < range.upperBound { value.wrappedValue += 1 }
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundStyle(value.wrappedValue < range.upperBound ? .blue : .gray)
                }
                .disabled(value.wrappedValue >= range.upperBound)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

// MARK: - API Setup Sheet
struct APISetupView: View {
    @State private var googleKey = UserDefaults.standard.string(forKey: "google_places_api_key") ?? ""
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    SecureField("Google Places API Key", text: $googleKey)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                } header: {
                    Text("Google Places API Key")
                } footer: {
                    Text("Required for live hotel search. Without a key the app uses built-in demo data. Get a free key at console.cloud.google.com → Places API.")
                }

                Section("Without API Key") {
                    Label("App uses demo data with 10 real Anaheim hotels", systemImage: "info.circle.fill")
                        .foregroundStyle(.blue)
                        .font(.subheadline)
                }
            }
            .navigationTitle("Configuration")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        UserDefaults.standard.set(googleKey, forKey: "google_places_api_key")
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}
