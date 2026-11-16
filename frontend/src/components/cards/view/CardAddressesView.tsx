import React from 'react';
import { CardAddressDto } from '../../../types/types';
import { useTranslation } from 'react-i18next';

interface Props {
  addresses: CardAddressDto[];
}

const CardAddressesView: React.FC<Props> = ({ addresses }) => {
  const { t } = useTranslation('global');

  const itemStyle: React.CSSProperties = {
    padding: 8,
    background: 'var(--color01)',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    fontSize: 13,
    color: 'var(--color03)',
  };

  if (!addresses || addresses.length === 0) {
    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <li style={itemStyle}>{t('cards.lack_of_addresses')}</li>
      </ul>
    );
  }

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {addresses.map((a, i) => (
        <li key={i} style={itemStyle}>
          <div style={{ fontWeight: 600 }}>{a.gymName ?? a.city}</div>
              <div style={{ fontSize: 13, color: 'var(--color03)' }}>{a.gymAddress}</div>
              <div style={{ fontSize: 12, color: 'var(--color03)' }}>{a.city}{a.countryName ? `, ${a.countryName}` : ''}</div>
        </li>
      ))}
    </ul>
  );
};

export default CardAddressesView;
