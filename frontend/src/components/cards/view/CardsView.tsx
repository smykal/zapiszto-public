import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CardService from '../../../services/card/CardService';
import { CardViewDto } from '../../../types/types';
import IUser from '../../../types/user.type';
import Spinner from '../../../common/Spinner';
import CardItem from './CardItem';

const CardsView: React.FC = () => {
  const { t } = useTranslation('global');
  const [cards, setCards] = useState<CardViewDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = React.useState<IUser | null>(null);


  const loadCards = useCallback(() => {
    setLoading(true);
    setError(null);
    CardService.getCards()
      .then((resp) => {
        setCards(resp.data ?? []);
      })
      .catch((err) => {
        console.error('Error loading cards list:', err);
        setError(t('cards.list_load_error') ?? 'Error loading cards');
        setCards(null);
      })
      .finally(() => setLoading(false));
  }, [t]);

  const hasRole = (role: string): boolean => {
    return currentUser?.roles?.includes(role) ?? false;
  };

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  if (loading) return <Spinner />;

  if (error) {
    return <div style={{ color: 'var(--color03)', textAlign: 'center', marginTop: '1rem' }}>{error}</div>;
  }

  if (!cards || cards.length === 0) {
    return (
      <div>
        {hasRole('ROLE_ADMIN') && (
          <div className="card-container center">
            <button onClick={loadCards} className="field-button" style={{ marginTop: '1rem' }}>
              🔁 {t('cards.refresh', 'Odśwież')}
            </button>
          </div>)}
      </div>
    );
  }

  return (
    <div className="card-container center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onRefresh={loadCards} />
        ))}
      </div>
    </div>
  );
};

export default CardsView;