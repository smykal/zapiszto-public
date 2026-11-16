import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../constants/Modal';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardFieldMail: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation('global');

  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState<string>(value ?? '');

  useEffect(() => {
    setTempValue(value ?? '');
  }, [value]);

  const open = () => setShowModal(true);
  const close = () => {
    setShowModal(false);
    setTempValue(value ?? '');
  };

  const save = () => {
    const synthetic = { target: { value: tempValue } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(synthetic);
    setShowModal(false);
  };

  const iconSrc = value ? '/images/mail/envelope_color.svg' : '/images/mail/envelope_white.svg';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button
        type="button"
        onClick={open}
        aria-label={t('cards.mail_edit') ?? 'Edit mail'}
        className="icon-button"
      >
        <img
          src={iconSrc}
          alt="mail"
          style={{ width: 28, height: 28, display: 'block' }}
        />
      </button>

      <Modal show={showModal} onClose={close} title={t('cards.mail')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <input
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={t('cards.mail_placeholder')}
          />
            <button type="button" onClick={save} className='field'>
              {t('buttons.save')}
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default CardFieldMail;