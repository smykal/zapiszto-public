import React, { useEffect, useState, useCallback } from 'react';
import CardStatusService from '../../../../services/card/CardStatusService';
import { CardStatusDto, DictCardStatusDto } from '../../../../types/types';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../../common/Spinner';

interface Props {
  cardId: string; // zamiast globalnego onRefresh — teraz przyjmujemy konkretny cardId
  onRefresh: () => void;
}

const CardOptions: React.FC<Props> = ({ cardId, onRefresh }) => {
  const { t } = useTranslation('global');
  const [cardStatus, setCardStatus] = useState<CardStatusDto | null>(null);
  const [allowedStatuses, setAllowedStatuses] = useState<DictCardStatusDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);

  const loadStatuses = useCallback(() => {
    setLoading(true);
    setError(null);

    const p1 = CardStatusService.getCardStatusActual(cardId)
      .then((resp) => setCardStatus(resp))
      .catch((err) => {
        console.error('Error loading card status:', err);
        setError(t('cards.status_load_error') ?? 'Error loading status');
        setCardStatus(null);
      });

    const p2 = CardStatusService.getCardStatusesAllowedToDo(cardId)
      .then((resp) => setAllowedStatuses(resp ?? []))
      .catch((err) => {
        console.error('Error loading allowed statuses:', err);
        setError(t('cards.status_load_error') ?? 'Error loading status list');
        setAllowedStatuses(null);
      });

    Promise.all([p1, p2]).finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const handlePostStatus = async (status: DictCardStatusDto) => {
    try {
      setPostingId(status.id);
      setError(null);

      const payload: CardStatusDto = {
        cardId: cardId,
        dictCardStatusId: status.id,
        dictCardStatusName: status.statusName,
        comment: ''
      };

      await CardStatusService.postCardStatus(payload);

      await loadStatuses();
      onRefresh();
    } catch (err) {
      console.error('Error posting card status:', err);
      setError(t('cards.status_post_error') ?? 'Error changing status');
    } finally {
      setPostingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <button
        onClick={() => {
          loadStatuses();
          onRefresh();
        }}
        className="field-button"
      >
        🔁 {t('cards.refresh', 'Odśwież')}
      </button>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{ color: 'var(--color03)', fontSize: 12 }}>{error}</div>
      ) : (
        <>
          {allowedStatuses && allowedStatuses.length > 0 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {allowedStatuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handlePostStatus(s)}
                  disabled={postingId !== null}
                  title={s.statusName}
                  style={{
                    padding: '4px 8px',
                    background: postingId === s.id ? 'var(--color03)' : 'var(--color07)',
                    color: 'var(--color02)',
                    borderRadius: 6,
                    fontSize: 12,
                    border: 'none',
                    cursor: postingId ? 'wait' : 'pointer'
                  }}
                >
                  {postingId === s.id ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Spinner/>
                      {s.statusName}
                    </span>
                  ) : (
                    s.statusName
                  )}
                </button>
              ))}
            </div>
          )}

          <div>
            {t('cards.current_status', 'Status')}:{' '}
            <span>
              {cardStatus?.dictCardStatusName ?? t('cards.status_unknown', 'Brak statusu')}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOptions;