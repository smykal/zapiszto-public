import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../constants/Modal';
import CardTitleView from '../../view/CardTitleView';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardFieldTitle: React.FC<Props> = ({ value, onChange }) => {
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

  const display = value && value.trim() !== '' ? value : (t('cards.title'));

  return (
    <div style={{flex: '1', display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: 'max-content' }}>
      <button
        type="button"
        onClick={open}
        aria-label={t('cards.edit') ?? 'Edit'}
        className="icon-button"
      >
        <img src="/images/navigation/edit_white.svg" alt="edit" style={{ width: 28, height: 28, display: 'block' }} />
      </button>
      <CardTitleView value={display} />
      

      <Modal show={showModal} onClose={close} title={t('cards.title_modal_title') ?? 'Edit title'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Ala ma kota - max length 30 chars"
            style={{ padding: '8px', fontSize: 14 }}
            maxLength={30}
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
    </div>
  );
};

export default CardFieldTitle;