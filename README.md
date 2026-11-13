# EventPro - GST 18% Invoice & Quotation Manager

Tailored specifically for **Event Management & Production Organizations**. Features real-time calculation, official SAC codes, split 18% GST (CGST 9% + SGST 9% or IGST 18%), dynamic UPI payment QR codes, and **pixel-perfect A4 printing**.

---

## 🌟 Key Features

1. **True A4 Print Size (`210mm × 297mm`)**:
   - Single-click **"Print A4 Size"** button (or `Ctrl + P`).
   - Clean native print stylesheet that strips all UI chrome, fits precisely on standard A4 paper, and avoids awkward page breaks.
   - **"Export PDF"** button for direct vector-clear PDF generation.

2. **18% GST Engine (Event Management Compliance)**:
   - **Intra-State**: Automatically splits into **9% CGST + 9% SGST** when billing within your state.
   - **Inter-State**: Automatically switches to **18% IGST** when client state differs.
   - Standard SAC Code selector pre-populated with:
     - `998596`: Event Management & Organization Services
     - `998597`: Other Event Production Services
     - `999612`: Sound, Stage & Lighting Production
     - `999613`: Artists, DJs & Emcee Management
     - `998311`: Photography, Videography & Drone
     - `996331`: Event Hospitality & Catering
   - Automatic conversion of total into Indian Currency Words (e.g. *"Indian Rupees Seven Lakh Fifty-Eight Thousand Only"*).

3. **Event Production Specifics**:
   - Event Name, Event Type, Venue, Event Dates, Guest Count (Pax), and Client POC.
   - Quick-add presets for Stage & Set, LED Wall, Line Array Sound, Intelligent Lighting, Artists/Emcee, and Management Fees.
   - Advance payment tracking with highlighted **Balance Payable**.

4. **Dynamic UPI QR Code**:
   - Automatically embeds a scannable UPI QR code on the printed A4 invoice with your UPI ID and the exact balance amount due.

5. **Cross-Platform: Desktop Software & Android APK**:
   - **Desktop**: Launch directly with `Launch-Software.bat`.
   - **Android APK**: Pre-configured Capacitor Android project inside the `android/` folder.

---

## 🚀 How to Run the Software (Desktop)

Simply double-click:
```
Launch-Software.bat
```
*(Or run `npm run start` in terminal)*. The software will open automatically in your browser with full offline support.

---

## 📱 How to Build the Android APK

1. Double click:
   ```
   Build-Android-APK.bat
   ```
   *(Or run `npm run cap:sync`)*
2. To compile the `.apk` using Android Studio:
   - It will open the `android/` folder in Android Studio.
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - Your `.apk` will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`.
3. Or build directly from command line (if Android SDK is installed):
   ```bash
   cd android
   gradlew assembleDebug
   ```

---

## 📁 Project Structure

```
d:\GST invoice\
├── android/                 # Native Android project ready for APK export
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Print A4, PDF download & WhatsApp actions
│   │   ├── InvoiceForm.tsx   # Item, Client, Event & Financial editor
│   │   └── InvoiceA4View.tsx # Pixel-perfect A4 invoice template
│   ├── utils/
│   │   └── formatters.ts    # Indian Rupee formatting & number-to-words
│   ├── types.ts             # TypeScript definitions
│   ├── constants.ts         # Indian states, GST codes & event defaults
│   ├── App.tsx              # Split-screen responsive workspace
│   └── index.css            # Tailwind + @page A4 print stylesheet
├── Launch-Software.bat      # One-click Windows desktop software launcher
├── Build-Android-APK.bat    # One-click APK sync & build trigger
└── package.json
```
