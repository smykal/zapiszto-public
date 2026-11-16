import React, { useEffect, useState } from 'react';
import { CardAddressDto } from '../../../../../types/types';
import Spinner from '../../../../../common/Spinner';
import Modal from '../../../../../constants/Modal';
import CardAddressesEdit from './CardAddressesEdit';
import CardAddressesDelete from './CardAddressesDelete';
import { useTranslation } from 'react-i18next';
import { useGetAddressesByCardId } from '../../../../../services/cardAddresses/CardAddressesTanstackService';


interface Props {
  cardId?: string;
}

const CardAddresses: React.FC<Props> = ({ cardId }) => {
  const { t } = useTranslation('global');

  const [addresses, setAddresses] = useState<CardAddressDto[] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { data, isLoading, isError } = useGetAddressesByCardId(cardId);

  useEffect(() => {
    setAddresses(cardId ? data ?? [] : []);
  }, [cardId, data]);

  const handleAddSaved = (created: CardAddressDto) => {
    setAddresses(prev => prev ? [created, ...prev] : [created]);
  };

  const handleAddressDeleted = (addressId: string) => {
    setAddresses(prev => prev ? prev.filter(a => a.id !== addressId) : null);
  };

  if (isLoading) return <Spinner />;

  if (isError) return <div style={{ color: 'var(--color03)' }}>Błąd ładowania</div>;

  return (
    <div>
      <div style={{ flex: '1' }}>
        <div style={{ background: 'var(--color01)', borderRadius: 6, marginBottom: '.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '.5rem' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            aria-label="Dodaj adres"
            className="icon-button"
          >
            <img src="/images/navigation/edit_white.svg" alt="add" style={{ width: 22, height: 22 }} />
            {t('cards.add_address')}
          </button>
        </div>

      </div>

      {
        (!addresses || addresses.length === 0) ? (
          <div style={{ padding: 8, background: 'var(--color01)', borderRadius: 6 }}>{t('cards.stationary_trainings')}</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {addresses.map((a) => (
              <li key={a.id} style={{ padding: 8, background: 'var(--color01)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{a.gymName ?? a.city}</div>
                  <div style={{ fontSize: 13, color: 'var(--color03)' }}>{a.gymAddress}</div>
                  <div style={{ fontSize: 12, color: 'var(--color03)' }}>{a.city}{a.countryName ? `, ${a.countryName}` : ''}</div>
                </div>
                <CardAddressesDelete addressId={a.id} onDeleted={() => handleAddressDeleted(a.id)} />
              </li>
            ))}
          </ul>
        )
      }

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Dodaj adres">
        {cardId ? (
          <CardAddressesEdit
            cardId={cardId}
            onClose={() => setShowAddModal(false)}
            onSaved={(created) => {
              handleAddSaved(created);
              setShowAddModal(false);
            }}
          />
        ) : (
          <div>Brak identyfikatora karty</div>
        )}
      </Modal>
    </div >
  );
};

export default CardAddresses;