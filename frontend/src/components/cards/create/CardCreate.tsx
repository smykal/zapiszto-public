import React, { useState } from 'react';
import CardService from '../../../services/card/CardService';
import { CardDto } from '../../../types/types';
import { useTranslation } from 'react-i18next';

interface Props {
  onCreated?: (card: CardDto) => void;
}

const CardCreate: React.FC<Props> = ({ onCreated }) => {
  const { t } = useTranslation('global');
  const [card, setCard] = useState<CardDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCard = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await CardService.setUpCard();
      setCard(resp.data);
      onCreated && onCreated(resp.data);
    } catch (e) {
      console.error('Error generating card:', e);
      setError(t('cards.generate_error') ?? 'Error generating card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <button onClick={handleGenerateCard} disabled={loading}>
        {loading ? (t('buttons.generating') ?? 'Generating...') : (t('cards.create_card'))}
      </button>

      {error && <div style={{ color: 'var(--color04)', marginTop: '.5rem' }}>{error}</div>}

      {card && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{t('cards.id') ?? 'ID'}:</strong> {card.id}</p>
          <p><strong>{t('cards.title') ?? 'Title'}:</strong> {card.title}</p>
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
            <button type="button" onClick={() => navigator.clipboard.writeText(card.id || '')}>
              {t('buttons.copy_id') ?? 'Copy ID'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCreate;