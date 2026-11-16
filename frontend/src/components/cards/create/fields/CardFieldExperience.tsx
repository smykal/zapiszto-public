import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../constants/Modal';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CardFieldExperience: React.FC<Props> = ({ value, onChange }) => {
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
    const synthetic = { target: { value: tempValue } } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(synthetic);
    setShowModal(false);
  };

  const display = value && value.trim() !== '' ? value : (t('cards.experience_placeholder') ?? 'e.g. 5 years');

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={open}
          aria-label={t('cards.edit') ?? 'Edit'}
          className="icon-button"
        >
          <img src="/images/navigation/edit_white.svg" alt="edit" style={{ width: 28, height: 28, display: 'block' }} />
        </button>
        {display}
      </div>

      <Modal show={showModal} onClose={close} title={t('cards.experience_modal_title')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={t('cards.experience_placeholder') ?? 'e.g. 5 years'}
            style={{ padding: '8px', fontSize: 14, minHeight: '6rem', resize: 'vertical' }}
            maxLength={2000}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" onClick={close} style={{ padding: '6px 10px' }}>
              {t('buttons.cancel')}
            </button>
            <button type="button" onClick={save} style={{ padding: '6px 10px' }}>
              {t('buttons.save')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardFieldExperience;