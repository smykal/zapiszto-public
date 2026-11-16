import React, { useEffect, useState, useCallback } from 'react';
import CardService from '../../../services/card/CardService';
import { CardViewDto } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../common/Spinner';
import CardOptions from './options/CardOptions';
import CardItem from './CardItem'; // <- nowy import

const CardView: React.FC = () => {
    const { t } = useTranslation('global');
    const [card, setCard] = useState<CardViewDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCard = useCallback(() => {
        setLoading(true);
        setError(null);
        CardService.viewCard()
            .then((resp) => {
                if (!resp.data) {
                    setCard(null);
                } else {
                    setCard(resp.data);
                }
            })
            .catch((err) => {
                console.error('Error loading card view:', err);
                setError(t('cards.load_error') ?? 'Error loading card data');
                setCard(null);
            })
            .finally(() => setLoading(false));
    }, [t]);

    useEffect(() => {
        loadCard();
    }, [loadCard]);

    if (loading) return <Spinner />;

    if (error)
        return (
            <div style={{ color: 'var(--color03)', textAlign: 'center', marginTop: '1rem' }}>
                {error}
            </div>
        );

    if (!card)
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--color02)' }}>
                    {t('cards.not_created', 'Wizytówka nie została jeszcze utworzona.')}
                </p>
                <button
                    onClick={() => { loadCard(); }}
                    className="field-button"
                    style={{ marginTop: '1rem' }}
                >
                    🔁 {t('cards.try_again', 'Spróbuj ponownie')}
                </button>
            </div>
        );

    return (
        <div>
            <CardOptions cardId={card.id} onRefresh={() => { loadCard(); }} />

            <CardItem card={card} />
        </div>
    );
};

export default CardView;
