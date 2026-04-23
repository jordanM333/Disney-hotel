# Disneyland Hotel Finder – iOS App

A native iOS app (Swift / SwiftUI) that searches for hotels within **1 mile** of Disneyland, compares prices and ratings, surfaces discounts, and links directly to booking platforms.

---

## Features

| Feature | Details |
|---|---|
| **1-mile radius search** | Hardcoded to Disneyland (33.8121, -117.9190) |
| **Date picker** | Compact date pickers for check-in / check-out |
| **Guest selection** | Adults (1–8) and children (0–6) steppers |
| **Live hotel data** | Google Places Nearby Search API (optional) |
| **Demo mode** | 10 real Anaheim hotels baked in — works without any API key |
| **Pricing** | Estimated from Google price level; replace with live API |
| **Discount detection** | AAA, AARP, Military, Costco Travel, Hotels.com, Booking.com |
| **Smart sort** | Best Value · Lowest Price · Top Rated · Closest · Most Deals |
| **Filters** | Max price/night slider, min rating slider |
| **Booking links** | Hotels.com · Booking.com · Expedia · Google Hotels · Hotel website |
| **Favorites** | Heart any hotel; dedicated Saved tab |
| **Dark mode** | Full support via SwiftUI adaptive colors |

---

## Requirements

- **Xcode 15+**
- **iOS 17.0+** deployment target
- **Swift 5.9+**

---

## Getting Started

### 1 · Clone & open

```bash
git clone <repo-url>
open DisneylandHotelFinder/DisneylandHotelFinder.xcodeproj
```

### 2 · Build & run

Select **iPhone 15 (or newer) simulator** → press **⌘R**.

The app runs immediately in **demo mode** using 10 built-in hotels (no API key needed).

### 3 · Add a Google Places API key (optional — for live data)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → enable **Places API**
3. Create an API key (restrict it to iOS apps / Places API)
4. In the app tap **⚙ (gear icon)** on the Search tab → paste your key → Save

With a key the app fetches live hotel listings from Google Places and enriches them with website URLs and phone numbers.

---

## Project Structure

```
DisneylandHotelFinder/
├── DisneylandHotelFinder.xcodeproj/
└── DisneylandHotelFinder/
    ├── DisneylandHotelFinderApp.swift   # @main entry
    ├── ContentView.swift                # TabView (Search / Results / Saved)
    ├── Models/
    │   ├── Hotel.swift                  # Data model + mock data
    │   ├── SearchParameters.swift       # Dates, guests, sort/filter
    │   └── HotelDeal.swift              # Discount / deal model
    ├── Views/
    │   ├── SearchView.swift             # Date pickers + guest steppers
    │   ├── HotelListView.swift          # Scrollable results list
    │   ├── HotelCardView.swift          # Card component
    │   ├── HotelDetailView.swift        # Full detail + booking sheet
    │   ├── FilterSortView.swift         # Filter & sort sheet
    │   └── FavoritesView.swift          # Saved hotels tab
    ├── ViewModels/
    │   └── HotelSearchViewModel.swift   # @MainActor ObservableObject
    ├── Services/
    │   ├── GooglePlacesService.swift    # Google Places API + fallback
    │   ├── HotelPricingService.swift    # Pricing estimation / live API hook
    │   └── DiscountService.swift        # Deal injection (AAA, AARP, etc.)
    └── Utilities/
        ├── Constants.swift              # Coordinates, API base URLs, booking URLs
        └── LocationHelper.swift         # Distance / walking-time calculations
```

---

## Booking Platforms

The app constructs deep-link search URLs pre-filled with your dates and guest count for:

- **Hotels.com** – `hotels.com/search.do?…`
- **Booking.com** – `booking.com/searchresults.html?…`
- **Expedia** – `expedia.com/Hotel-Search?…`
- **Google Hotels** – `google.com/travel/hotels/…`
- **Hotel website** – direct link from Google Places details

---

## Discount Sources

Every hotel result is checked against:

| Source | Typical Savings |
|---|---|
| AAA Member Rate | ~10% off BAR |
| AARP Senior Rate | ~10% off (55+) |
| Military Appreciation | ~10% off (active, veteran, first responder) |
| Costco Travel | 10–15% + hotel credit |
| Hotels.com One Key | Earn stamp toward free night |
| Booking.com Genius | ~10% secret prices |

---

## Adding Live Pricing (Hotels.com via RapidAPI)

`HotelPricingService.swift` currently returns estimated prices. To plug in live data:

1. Sign up at [rapidapi.com](https://rapidapi.com) → subscribe to **Hotels.com API**
2. In `HotelPricingService.applyPricing(to:params:)` replace the estimation logic with a `URLSession` call to `https://hotels4.p.rapidapi.com/properties/v2/list` using your key in the `X-RapidAPI-Key` header.
3. Store the key in `UserDefaults` under `"rapid_api_key"` (mirror the Google key pattern in `Constants.API`).

---

## License

MIT
