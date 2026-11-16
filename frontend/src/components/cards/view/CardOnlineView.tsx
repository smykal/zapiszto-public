import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  online: boolean;
}

const CardOnlineView: React.FC<Props> = ({ online }) => {
  const { t } = useTranslation('global');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '1rem',
        marginTop: '.2rem',
        padding: 8, 
        background: 'var(--color01)', 
        borderRadius: 6
      }}
    >
      <span>{t('cards.online_trainings') ?? 'Online trainings available'}</span>
      {online ? (
        <span style={{ color: 'green', fontSize: '1.2rem' }}>✅</span>
      ) : (
        <span style={{ color: 'red', fontSize: '1.2rem' }}>❌</span>
      )}
    </div>
  );
};

export default CardOnlineView;
