import React, { useMemo, useState, useCallback } from 'react'
import './index.css'
import { ItemRow } from './components/ItemRow'
import { Totals } from './components/Totals'
import { ITEMS } from './data/items'
import { calculateTotals } from './utils/calculations'

const createEmptyRow = () => ({
  itemId: '',
  quantity: '',
})

const MAX_ROWS = 5

const App = () => {
  const [rows, setRows] = useState([createEmptyRow()])

  const handleRowChange = useCallback((index, updatedRow) => {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...updatedRow }
      return next
    })
  }, [])

  const handleAddRow = () => {
    setRows((prev) => {
      if (prev.length >= MAX_ROWS) return prev
      return [...prev, createEmptyRow()]
    })
  }

  const handleRemoveRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) {
        return [createEmptyRow()]
      }
      const next = prev.filter((_, i) => i !== index)
      return next.length === 0 ? [createEmptyRow()] : next
    })
  }

  const totals = useMemo(
    () => calculateTotals(rows, ITEMS, 50, 2),
    [rows]
  )

  const hasReachedMaxRows = rows.length >= MAX_ROWS

  return (
    <div className="min-h-screen bg-bg px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-text">Smart Item Calculation Module</h1>
            <p className="mt-1 text-sm text-muted">
              ERP-style item entry with precision-safe calculations, tax handling, and automatic
              discount application.
            </p>
          </div>
        </header>

        <main className="space-y-4 md:space-y-6">
          <section className="rounded-lg bg-card p-3 shadow-card border border-border sm:p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-text">Item Entry</h2>
                <p className="text-xs text-muted">
                  Maximum of {MAX_ROWS} item rows. Quantity cannot exceed available stock.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                disabled={hasReachedMaxRows}
                className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  hasReachedMaxRows
                    ? 'bg-slate-100 text-muted cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-blue-700 active:bg-blue-800 shadow-soft'
                }`}
              >
                Add Item Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[720px] rounded-md border border-border bg-slate-50">
                <div className="grid grid-cols-[1.4fr,0.8fr,0.9fr,0.8fr,0.8fr,0.9fr,0.4fr] gap-2 border-b border-border bg-slate-100 px-3 py-2 text-[11px] font-medium text-muted">
                  <div>Item</div>
                  <div>Unit</div>
                  <div>Quantity</div>
                  <div>Rate</div>
                  <div>Tax</div>
                  <div>Amount / Tax / Net</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="px-3">
                  {rows.map((row, index) => (
                    <ItemRow
                      key={index}
                      index={index}
                      row={row}
                      onChange={handleRowChange}
                      onRemove={handleRemoveRow}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <Totals totals={totals} />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App