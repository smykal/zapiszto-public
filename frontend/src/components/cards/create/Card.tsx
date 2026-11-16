import React, { useEffect, useState } from 'react';
import CardService from '../../../services/card/CardService';
import CardCreate from './CardCreate';
import CardEdit from './CardEdit';
import { CardDto } from '../../../types/types';
import Spinner from '../../../common/Spinner';

const Card: React.FC = () => {
  const [card, setCard] = useState<CardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    CardService.getCardByUser()
      .then(resp => {
        setCard(resp.data);
      })
      .catch(err => {
        console.warn('No card or error fetching card:', err);
        setCard(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newCard: CardDto) => {
    setCard(newCard);
  };

  const handleUpdated = (updated: CardDto) => {
    setCard(updated);
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ alignItems: 'center' }}>
      {card ? (
        <CardEdit initialCard={card} onUpdated={handleUpdated} />
      ) : (
        <CardCreate onCreated={handleCreated} />
      )}
    </div>
  );
};

export default Card;