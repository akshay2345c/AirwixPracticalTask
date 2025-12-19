## Smart Item Calculation Module (ERP-style)

This is a small **ERP-style Smart Item Calculation Module** built with **React**, **Vite**, and **Tailwind CSS** (no backend, no UI libraries).

You can use it to simulate item entry in an ERP screen with:
- Dropdown item selection
- Auto-filled unit, stock, rate, and tax
- Row-wise amount / tax / net calculations
- Live global totals and automatic discount when quantity is high

---

### 1. Tech Stack

- **React (functional components + hooks only)**
- **Vite** as the bundler
- **Tailwind CSS v4** for styling
- **JavaScript only** 
- **No backend**, all data is static in the frontend

---

### 2. How to Run the Project

Follow these steps from the project root:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Vite will show a local URL in the terminal (usually `http://localhost:5173`).
   - Open it in your browser.

4. (Optional) **Create a production build**
   ```bash
   npm run build
   ```

---

### 3. How the Screen Works (Beginner Friendly)

The main screen has:

- **Item table**
  - Up to **5 rows**
  - Each row lets you:
    - Pick an item from a dropdown
    - Enter a **decimal quantity**
    - See unit, available stock, rate, and tax auto-filled
  - You also see **Amount**, **Tax**, and **Net Amount** per row.

- **Totals section**
  - Shows **Total Quantity**, **Total Tax**, and **Grand Total**
  - Shows **discount rule**, **discount applied**, **discount amount**, and **final grand total**

Everything updates **automatically** as you type. There is **no submit button**.

---

### 4. Precision Handling (How decimals are managed)

Handling money and quantities is done in two layers:

- **Raw values for calculations**
  - All math uses the **raw JavaScript numbers** (no early rounding).
  - Example: for a row we calculate:
    - `amountRaw = quantity × rate`
    - For **exclusive tax**: `tax = amountRaw × (tax_rate / 100)`
    - For **inclusive tax**: we **extract** tax from the total using:
      \[ base = \frac{amountRaw}{1 + (tax\_rate / 100)} \]
      \[ tax = amountRaw - base \]

- **Rounded values only for display**
  - Before showing values, we round them to **2 decimals** using a helper.
  - This keeps the UI clean while calculations stay accurate.

- **Stock vs quantity validation**
  - Quantity is treated as a decimal.
  - If quantity **exceeds available stock**, an inline **error message** appears for that row.

---

### 5. Tax & Discount Logic

#### Per-row tax logic

Each item in `src/data/items.js` defines:
- `rate`
- `tax_rate`
- `tax_type` (`inclusive` or `exclusive`)

For each row:
- **Amount** = quantity × rate
- **If tax is inclusive**
  - Amount already contains tax.
  - We split it into base + tax using the formulas above.
  - Net amount = **amount (unchanged)**.
- **If tax is exclusive**
  - Tax is computed on top of the amount.
  - Net amount = **amount + tax**.

#### Global totals & discount

The totals are computed using **`useMemo`** based on all rows:

- **Total Quantity** = sum of all quantities
- **Total Tax** = sum of all per-row tax amounts
- **Grand Total** = sum of all per-row net amounts

**Business rule:**
- If **Total Quantity > 50**, we apply an extra **2% discount** on the **Grand Total**.
- The UI clearly shows:
  - Whether discount is applied (Yes/No)
  - Discount rate
  - Discount amount
  - Grand total **after** discount

---

### 6. Performance Notes

To avoid unnecessary re-renders:

- The **`ItemRow`** component is wrapped in `React.memo`.
- The **`Totals`** component is also wrapped in `React.memo` with a shallow comparison of totals.
- Global totals are calculated using **`useMemo`**, so they only re-run when the rows change.

This keeps the UI smooth even when you interact quickly with multiple rows.

---

### 7. Responsiveness

The layout is **mobile-first** and works from **280px to 1600px**:
- The item table:
  - Uses **horizontal scroll** on small screens (narrow phones).
  - Looks like a **full desktop table** on larger screens.
- The totals section:
  - **Stacks vertically** on mobile.
  - **Aligns side by side** on desktop.

All inputs are sized to stay within the screen and not overflow.
