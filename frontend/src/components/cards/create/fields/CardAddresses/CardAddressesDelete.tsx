import React, { useState } from 'react';
import CardService from '../../../../../services/card/CardService';
import Spinner from '../../../../../common/Spinner';

interface Props {
  addressId: string;
  onDeleted: () => void;
}

const CardAddressesDelete: React.FC<Props> = ({ addressId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm('Usuń ten adres?');
    if (!ok) return;

    setLoading(true);
    try {
      await CardService.deleteAddress(addressId);
      onDeleted();
    } catch (err) {
      console.error('Error deleting address', err);
      alert('Błąd usuwania adresu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#e74c3c',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: 12,
        padding: 0
      }}
    >
      {loading ? <Spinner /> : 'Usuń'}
    </button>
  );
};

export default CardAddressesDelete;