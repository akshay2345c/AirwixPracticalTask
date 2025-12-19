const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

const round2 = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export const formatDecimal = (value, decimals = 2) => {
  const num = toNumber(value)
  return num.toFixed(decimals)
}

export const calculateItemRow = (row, itemDefinition) => {
  if (!row || !itemDefinition) {
    return {
      amount: 0,
      taxAmount: 0,
      netAmount: 0,
      hasValue: false,
    }
  }

  const qty = toNumber(row.quantity)
  if (!qty) {
    return {
      amount: 0,
      taxAmount: 0,
      netAmount: 0,
      hasValue: false,
    }
  }

  const rate = toNumber(itemDefinition.rate)
  const taxRate = toNumber(itemDefinition.tax_rate)
  const taxType = itemDefinition.tax_type

  const amountRaw = qty * rate

  let baseAmount = amountRaw
  let taxAmount = 0

  if (taxType === 'inclusive') {
    const divisor = 1 + taxRate / 100
    baseAmount = amountRaw / divisor
    taxAmount = amountRaw - baseAmount
  } else {
    taxAmount = (amountRaw * taxRate) / 100
    baseAmount = amountRaw
  }

  const netAmount = taxType === 'inclusive' ? amountRaw : amountRaw + taxAmount

  return {
    amount: round2(baseAmount),
    taxAmount: round2(taxAmount),
    netAmount: round2(netAmount),
    hasValue: true,
  }
}

export const calculateTotals = (rows, items, discountThresholdQty = 50, discountRate = 2) => {
  let totalQtyRaw = 0
  let totalTaxRaw = 0
  let grandTotalRaw = 0

  rows.forEach((row) => {
    if (!row?.itemId) return

    const item = items.find((it) => it.id === row.itemId)
    if (!item) return

    const { amount, taxAmount, netAmount, hasValue } = calculateItemRow(row, item)

    if (!hasValue) return

    const qty = toNumber(row.quantity)
    totalQtyRaw += qty
    totalTaxRaw += taxAmount
    grandTotalRaw += netAmount
  })

  const discountApplied = totalQtyRaw > discountThresholdQty
  const discountAmountRaw = discountApplied ? (grandTotalRaw * discountRate) / 100 : 0
  const grandAfterDiscountRaw = grandTotalRaw - discountAmountRaw

  return {
    totalQuantity: round2(totalQtyRaw),
    totalTax: round2(totalTaxRaw),
    grandTotal: round2(grandTotalRaw),
    discountApplied,
    discountRate,
    discountAmount: round2(discountAmountRaw),
    grandTotalAfterDiscount: round2(grandAfterDiscountRaw),
  }
}


