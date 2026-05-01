export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-TZ') + '/=';
}

export function formatInvoiceNumber(num: number): string {
  return String(num).padStart(5, '0');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}
