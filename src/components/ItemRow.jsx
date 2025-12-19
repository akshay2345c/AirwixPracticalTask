import React, { useMemo } from 'react'
import { calculateItemRow, formatDecimal } from '../utils/calculations'
import { ITEMS } from '../data/items'

const ItemRowComponent = ({ index, row, onChange, onRemove }) => {
  const selectedItem = useMemo(
    () => ITEMS.find((item) => item.id === row.itemId),
    [row.itemId]
  )

  const { amount, taxAmount, netAmount } = useMemo(
    () => calculateItemRow(row, selectedItem),
    [row, selectedItem]
  )

  const maxQty = selectedItem ? selectedItem.available_stock : 0
  const qtyNumber = row.quantity === '' ? '' : Number(row.quantity)
  const qtyExceedsStock =
    selectedItem && typeof qtyNumber === 'number' && !Number.isNaN(qtyNumber)
      ? qtyNumber > maxQty
      : false

  const handleItemChange = (e) => {
    const itemId = e.target.value
    const item = ITEMS.find((it) => it.id === itemId)
    if (!itemId || !item) {
      onChange(index, {
        itemId: '',
        quantity: '',
      })
      return
    }
    onChange(index, {
      itemId,
      quantity: row.quantity || '',
    })
  }

  const handleQuantityChange = (e) => {
    const val = e.target.value
    if (val === '') {
      onChange(index, { ...row, quantity: '' })
      return
    }
    if (!/^\d*\.?\d*$/.test(val)) {
      return
    }
    onChange(index, { ...row, quantity: val })
  }

  const showInlineError = qtyExceedsStock

  return (
    <div className="min-w-[720px] grid grid-cols-[1.4fr,0.8fr,0.9fr,0.8fr,0.8fr,0.9fr,0.4fr] gap-2 items-start text-sm py-2 border-b border-border last:border-b-0">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">Item</label>
        <select
          className="w-full rounded-sm border border-border bg-card px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
          value={row.itemId || ''}
          onChange={handleItemChange}
        >
          <option value="">Select item</option>
          {ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.item_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">Unit</label>
        <div className="rounded-sm border border-border bg-slate-50 px-2 py-1.5 text-xs text-muted">
          {selectedItem?.unit || '—'}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">
          Qty {selectedItem ? `(max ${formatDecimal(selectedItem.available_stock)})` : ''}
        </label>
        <input
          type="text"
          inputMode="decimal"
          className={`w-full rounded-sm border px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            showInlineError ? 'border-red-600 focus:ring-red-600' : 'border-border focus:ring-primary'
          }`}
          value={row.quantity ?? ''}
          onChange={handleQuantityChange}
          placeholder="0.00"
        />
        {showInlineError && (
          <span className="text-[11px] text-red-600">
            Quantity cannot exceed available stock ({formatDecimal(maxQty)})
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">Rate</label>
        <div className="rounded-sm border border-border bg-slate-50 px-2 py-1.5 text-xs text-muted">
          {selectedItem ? formatDecimal(selectedItem.rate) : '—'}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">Tax</label>
        <div className="rounded-sm border border-border bg-slate-50 px-2 py-1.5 text-xs text-muted">
          {selectedItem
            ? `${formatDecimal(selectedItem.tax_rate, 0)}% ${selectedItem.tax_type === 'inclusive' ? 'incl.' : 'excl.'}`
            : '—'}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted">Amount / Tax / Net</label>
        <div className="rounded-sm border border-border bg-card px-2 py-1.5 text-[11px] text-text flex flex-col gap-0.5">
          <div className="flex justify-between">
            <span className="text-muted">Amt</span>
            <span>{formatDecimal(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Tax</span>
            <span>{formatDecimal(taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Net</span>
            <span className="font-medium">{formatDecimal(netAmount)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 items-end justify-between">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-5 inline-flex items-center justify-center rounded-full border border-border bg-card px-2 py-1 text-[11px] text-muted hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export const ItemRow = React.memo(ItemRowComponent)


