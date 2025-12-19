import React from 'react'
import { formatDecimal } from '../utils/calculations'

export const Totals = React.memo(
  ({ totals }) => {
    const {
      totalQuantity,
      totalTax,
      grandTotal,
      discountApplied,
      discountRate,
      discountAmount,
      grandTotalAfterDiscount,
    } = totals

    return (
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-stretch">
        <div className="flex-1 rounded-md bg-card shadow-card border border-border px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Total Quantity</span>
            <span className="font-semibold">{formatDecimal(totalQuantity)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Total Tax</span>
            <span className="font-semibold">{formatDecimal(totalTax)}</span>
          </div>
          <div className="mt-1 h-px bg-border" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Grand Total (before discount)</span>
            <span className="font-semibold">{formatDecimal(grandTotal)}</span>
          </div>
        </div>

        <div className="flex-1 rounded-md bg-card shadow-card border border-border px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Discount Rule</span>
            <span className="text-xs text-muted">
              If total quantity &gt; 50, apply extra {discountRate}% discount
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Discount Applied</span>
            <span
              className={
                discountApplied
                  ? 'rounded-full bg-primarySoft px-2 py-0.5 text-xs text-primary font-medium'
                  : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted'
              }
            >
              {discountApplied ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Discount Amount</span>
            <span className={discountApplied ? 'text-success font-semibold' : 'text-muted'}>
              {formatDecimal(discountAmount)}
            </span>
          </div>

          <div className="mt-1 h-px bg-border" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Grand Total (after discount)</span>
            <span className="text-lg font-bold text-text">
              {formatDecimal(grandTotalAfterDiscount)}
            </span>
          </div>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.totals) === JSON.stringify(nextProps.totals)
  }
)


