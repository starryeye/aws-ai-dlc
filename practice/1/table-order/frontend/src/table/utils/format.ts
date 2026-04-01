const currencyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function calculateSubtotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

export function calculateTotalAmount(
  items: { unitPrice: number; quantity: number }[],
): number {
  return items.reduce(
    (sum, item) => sum + calculateSubtotal(item.unitPrice, item.quantity),
    0,
  );
}
