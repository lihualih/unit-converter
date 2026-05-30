# Unit & Currency Converter - ConvertAll

A free, modern, SEO-optimized online unit and currency converter website. Convert between currencies, length, weight, temperature, speed, area, volume, data storage, and time units instantly.

## Features

- **9 Converter Tools** covering all major unit categories
- **Real-time conversion** as you type
- **Live exchange rates** from Open Exchange Rates API (updated every 30 minutes)
- **Dark mode** with automatic system preference detection
- **Fully responsive** design for mobile, tablet, and desktop
- **SEO optimized** with proper meta tags, structured data, and semantic HTML
- **Ad placeholder slots** ready for Google AdSense integration
- **Swap button** to quickly reverse conversions
- **Deep linking support** via URL parameters
- **Zero dependencies** - pure HTML, CSS, and JavaScript

## Supported Conversions

### 1. Currency Converter
Convert between 30+ world currencies with live exchange rates:
USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN, BRL, KRW, SEK, NOK, DKK, NZD, SGD, HKD, TRY, ZAR, RUB, PLN, THB, IDR, MYR, PHP, TWD, ARS, CLP, COP, EGP, NGN, PKR, BDT, VND

### 2. Length Converter
Meters (m), Kilometers (km), Miles (mi), Feet (ft), Inches (in), Centimeters (cm), Millimeters (mm), Yards (yd)

### 3. Weight Converter
Kilograms (kg), Grams (g), Pounds (lb), Ounces (oz), Metric Tons (t), Stones (st)

### 4. Temperature Converter
Celsius (°C), Fahrenheit (°F), Kelvin (K)

### 5. Speed Converter
km/h, mph, m/s, Knots

### 6. Area Converter
Square Meters (m²), Square Feet (ft²), Square Kilometers (km²), Acres, Hectares

### 7. Volume Converter
Liters (L), Gallons (gal), Milliliters (ml), Cups, Fluid Ounces (fl oz)

### 8. Data Storage Converter
Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB)

### 9. Time Converter
Seconds, Minutes, Hours, Days, Weeks, Years

## Tech Stack

- **HTML5** - Semantic markup with proper SEO elements
- **CSS3** - Custom properties, flexbox, grid, responsive design
- **Vanilla JavaScript** - No frameworks or libraries
- **Google Fonts** - Inter and JetBrains Mono
- **Open Exchange Rates API** - Free currency exchange rates

## Project Structure

```
plan-g-unit-converter/
├── index.html              # Homepage with all converters listed
├── css/
│   └── style.css           # Complete styles (dark mode, responsive)
├── js/
│   └── common.js           # Shared utilities and converter logic
├── tools/
│   ├── currency.html       # Currency converter with live rates
│   ├── length.html         # Length converter
│   ├── weight.html         # Weight converter
│   ├── temperature.html    # Temperature converter
│   ├── speed.html          # Speed converter
│   ├── area.html           # Area converter
│   ├── volume.html         # Volume converter
│   ├── data.html           # Data storage converter
│   └── time.html           # Time converter
├── robots.txt              # Search engine crawler instructions
├── sitemap.xml             # XML sitemap for SEO
├── favicon.svg             # Site favicon
├── README.md               # This file
└── DEPLOY.md               # Deployment guide
```

## How to Use

1. **Local Development:** Simply open `index.html` in any modern web browser. No build step required.

2. **Using a local server** (recommended for currency API to work):
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000` in your browser.

## Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions for various hosting platforms.

**Quick Deploy Options:**
- **Netlify:** Drag and drop the project folder
- **Vercel:** Connect your Git repository
- **GitHub Pages:** Push to a repository and enable Pages
- **Cloudflare Pages:** Connect your repository
- **Any static hosting:** Upload all files via FTP/SFTP

## Revenue Model

This site is designed for **Google AdSense** monetization:

- **High traffic potential** from SEO-optimized pages targeting common conversion searches
- **Ad placeholder slots** are pre-positioned in optimal locations:
  - Top of each converter page (below header, above converter)
  - Bottom of each converter page (below converter, above content)
- **Expected RPM:** $5-15 for tool/utility sites
- **Target keywords:** High-volume, low-competition conversion queries

### AdSense Integration

1. Apply for Google AdSense after building traffic
2. Replace `<div class="ad-placeholder">` elements with AdSense ad units
3. Recommended ad sizes: 728x90 (leaderboard), 300x250 (medium rectangle), 336x280 (large rectangle)

## SEO Strategy

### Target Keywords (Long-tail)

| Page | Primary Keywords | Monthly Searches |
|------|-----------------|-----------------|
| Weight | kg to lbs, pounds to kg | 1M+ |
| Temperature | celsius to fahrenheit, °F to °C | 500K+ |
| Length | cm to inches, km to miles | 300K+ |
| Currency | usd to eur, dollar to euro | 200K+ |
| Volume | liters to gallons | 100K+ |
| Speed | km/h to mph | 50K+ |
| Data | gb to mb, mb to kb | 50K+ |
| Area | sq ft to sq m, acres to hectares | 30K+ |
| Time | hours to days, minutes to hours | 20K+ |

### SEO Features Implemented

- **Unique title tags** for each page with target keywords
- **Meta descriptions** optimized for click-through rate
- **Canonical URLs** to prevent duplicate content
- **Open Graph tags** for social media sharing
- **Structured data (JSON-LD)** for rich search results
- **Semantic HTML** with proper heading hierarchy
- **XML sitemap** for search engine discovery
- **robots.txt** for crawler guidance
- **Internal linking** between related converters
- **SEO content sections** with keyword-rich text
- **URL parameters** for deep linking to specific conversions
- **Fast loading** with no external dependencies (except Google Fonts)

### Content Strategy

Each converter page includes:
1. The converter tool (primary content)
2. Common conversion reference table
3. Educational content about the units
4. Internal links to related converters

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

Free to use for personal and commercial purposes.
