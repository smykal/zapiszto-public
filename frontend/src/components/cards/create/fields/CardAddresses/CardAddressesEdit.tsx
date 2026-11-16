import React, { useEffect, useState } from 'react';
import DictCountryService from '../../../../../services/dict/DictCountryService';
import Spinner from '../../../../../common/Spinner';
import { CardAddressDto, DictCountryDto } from '../../../../../types/types';
import { useCreateAddress } from '../../../../../services/cardAddresses/CardAddressesTanstackService';

interface Props {
  cardId: string;
  onClose: () => void;
  onSaved: (created: CardAddressDto) => void;
}

const CardAddressesEdit: React.FC<Props> = ({ cardId, onClose, onSaved }) => {
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countries, setCountries] = useState<DictCountryDto[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gymName: '',
    gymAddress: '',
    city: '',
    countryId: ''
  });
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createAddress } = useCreateAddress();

  useEffect(() => {
    let mounted = true;
    setLoadingCountries(true);
    DictCountryService.getDictCountry()
      .then((resp) => {
        if (!mounted) return;
        setCountries(resp.data ?? []);
      })
      .catch((err) => {
        console.error('Error loading countries', err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingCountries(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        cardId,
        gymName: form.gymName || undefined,
        gymAddress: form.gymAddress || undefined,
        city: form.city || undefined,
        countryId: form.countryId || undefined
      };
      const created = await createAddress(payload);
      if (created) {
        onSaved(created);
      } else {
        setError('Nie udało się dodać adresu');
      }
    } catch (err) {
      console.error('Error creating address', err);
      setError('Błąd zapisu');
    } finally {
      setSaving(false);
      // keep modal open only on error; close on success handled by parent via onSaved
      if (!error) onClose();
    }
  };

  return (
    <div>
      {loadingCountries ? (
        <div style={{ minWidth: 320 }}><Spinner /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 320 }}>
          <label style={{ fontSize: 13 }}>Siłownia (nazwa)</label>
          <input value={form.gymName} onChange={handleChange('gymName')} placeholder="Nazwa siłowni" />

          <label style={{ fontSize: 13 }}>Adres</label>
          <input value={form.gymAddress} onChange={handleChange('gymAddress')} placeholder="ul., nr" />

          <label style={{ fontSize: 13 }}>Miasto</label>
          <input value={form.city} onChange={handleChange('city')} placeholder="Miasto" />

          <label style={{ fontSize: 13 }}>Kraj</label>
          <select value={form.countryId} onChange={handleChange('countryId')}>
            <option value="">— wybierz —</option>
            {countries.map(c => (
              <option key={c.id} value={c.id}>{c.name ?? c.code ?? c.id}</option>
            ))}
          </select>

          {error && <div style={{ color: 'var(--color03)' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" onClick={onClose} disabled={saving}>Anuluj</button>
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardAddressesEdit;