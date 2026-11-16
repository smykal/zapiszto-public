import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  value?: string | null;
}

const CardTitleView: React.FC<Props> = ({ value }) => {
  const { t } = useTranslation('global');

  const display = value && value.trim() !== '' ? value : (t('cards.title'));

  return (
    <div className='card-title'>
      {display}
    </div>
  );
};

export default CardTitleView;
