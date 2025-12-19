## Manual Test Cases for Smart Item Calculation Module

Use these tests in the running app (browser) to manually verify core behavior.

---

### 1. Decimal quantity handling

- **Steps**
  - In the first row, select any item.
  - Enter a **decimal quantity**, e.g. `3.75`.
  - Observe the **Amount**, **Tax**, and **Net** values.
- **Expected**
  - The quantity field accepts `3.75` without error.
  - Amount, Tax, and Net update immediately.
  - Values show with **2 decimal places** (e.g. `4500.75`).

---

### 2. Quantity greater than available stock

- **Steps**
  - Pick an item with a visible available stock (for example, `High Precision Sensor`).
  - Note the **max stock** shown in the Qty label (e.g. `max 78.50`).
  - Enter a quantity **greater** than that, e.g. `100`.
- **Expected**
  - An inline **red error message** appears under the quantity input:
    - “Quantity cannot exceed available stock (...).”
  - The field shows a red border and red focus ring.
  - You can still see Amount/Tax/Net updating as you type, but the error clearly warns you.

---

### 3. Inclusive tax item calculation

- **Steps**
  - Add a row and select an item with `tax_type = inclusive` (e.g. `Industrial Valve`).
  - Enter a simple quantity like `1`.
  - Compare the displayed **Amount**, **Tax**, and **Net**.
- **Expected**
  - Net amount matches the **gross price** (amount including tax).
  - Tax is **extracted** from the amount:
    - `Amount` shows the base (before tax).
    - `Tax` shows the tax portion.
    - `Net` equals `Amount + Tax` and matches the gross (rate × quantity).

---

### 4. Quantity > 50 triggers discount

- **Steps**
  - Use one or more rows so that the **Total Quantity > 50**.
    - Example: select `Conveyor Belt` and enter quantity `60`.
  - Look at the **Totals** panel.
- **Expected**
  - `Total Quantity` shows a value greater than `50`.
  - In the right totals card:
    - “Discount Applied” badge shows **Yes** with highlighted styling.
    - “Discount Amount” is greater than `0.00`.
    - “Grand Total (after discount)” is **2% lower** than the original Grand Total value.

---

### 5. Empty row handling and max rows

- **Steps**
  - Start with the default single empty row.
  - Do **not** select an item or type a quantity.
  - Observe totals, then:
    - Click **Add Item Row** until you reach 5 rows.
    - Try to add a 6th row.
    - Remove rows until only one is left.
- **Expected**
  - With all rows empty, **all totals** (quantity, tax, grand total, discount) show as `0.00`, and discount applied is **No**.
  - You can add rows up to **5**, after which the Add button becomes **disabled** (greyed out).
  - Removing rows never leaves the screen completely empty — at least **one empty row** is always present for input.


