import { useLocalStorage } from './useLocalStorage';
import type { CompanySettings } from '../types';

const DEFAULT_SETTINGS: CompanySettings = {
  name: 'BLOOM GRAPHIC WORKS TZ',
  address: 'Lugalo Street Upanga Plot 1,',
  poBox: 'P.O.BOX 10',
  phone1: '+255 684 666 676',
  phone2: '+255 717 647771',
  email: 'bloomgraphicstz@gmail.com',
  website: 'www.bloomgraphicstz.com',
  defaultTerms: 'Goods Once Sold Are Non-Refundable',
  primaryColor: '#064e3b',
  nextInvoiceNumber: 3545,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<CompanySettings>(
    'invoice-settings',
    DEFAULT_SETTINGS
  );

  function updateSettings(updates: Partial<CompanySettings>) {
    setSettings((prev) => ({ ...prev, ...updates }));
  }

  function incrementInvoiceNumber() {
    setSettings((prev) => ({
      ...prev,
      nextInvoiceNumber: prev.nextInvoiceNumber + 1,
    }));
  }

  return { settings, updateSettings, incrementInvoiceNumber };
}
