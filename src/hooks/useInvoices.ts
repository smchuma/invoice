import { useLocalStorage } from './useLocalStorage';
import type { Invoice } from '../types';

export function useInvoices() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', []);

  function saveInvoice(invoice: Invoice) {
    setInvoices((prev) => {
      const exists = prev.findIndex((i) => i.id === invoice.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = invoice;
        return updated;
      }
      return [invoice, ...prev];
    });
  }

  function deleteInvoice(id: string) {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  }

  function getInvoice(id: string): Invoice | undefined {
    return invoices.find((i) => i.id === id);
  }

  return { invoices, saveInvoice, deleteInvoice, getInvoice };
}
