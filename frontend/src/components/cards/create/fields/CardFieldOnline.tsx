import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardFieldOnline: React.FC<Props> = ({ checked, onChange }) => {
  const { t } = useTranslation('global');
  return (
    <div style={{marginTop: '.2rem' ,paddingLeft: '.5rem', background: 'var(--color01)', borderRadius: 6 }}>
      <span >
        {t('cards.online_trainings')}
      
      <input type="checkbox" checked={checked} onChange={onChange} />
      </span>
   </div>
  );
};

export default CardFieldOnline;