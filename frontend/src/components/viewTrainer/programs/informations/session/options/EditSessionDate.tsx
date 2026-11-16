import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Modal from '../../../../../../constants/Modal';
import { useTranslation } from 'react-i18next';
import SessionService from '../../../../../../services/sessions/SessionsService';
import { SessionDto } from '../../../../../../types/types';

interface EditSessionDateProps {
    session: SessionDto | null;
    show: boolean;
    onClose: () => void;
    onSaved: (updatedSession: SessionDto) => void;
}

const DatePickerComponent = DatePicker as unknown as React.ComponentType<any>;

const EditSessionDate: React.FC<EditSessionDateProps> = ({ session, show, onClose, onSaved }) => {
    const { t } = useTranslation('global');
    const [newDateTime, setNewDateTime] = useState<Date | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (session?.dateTime) {
            setNewDateTime(new Date(session.dateTime));
        } else {
            setNewDateTime(new Date());
        }
    }, [session]);

    const handleSave = async () => {
        if (session && newDateTime) {
            try {
                await SessionService.updateSessionDateTime(session.id, newDateTime);
                onSaved({ ...session, dateTime: newDateTime.toISOString() });
                onClose();
            } catch (err) {
                console.error(err);
                setError(t('session.update_error'));
            }
        }
    };

    return (
        <Modal show={show} onClose={onClose} title={t('session.edit_date')}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <DatePickerComponent
                    selected={newDateTime}
                    onChange={(date: Date | null) => setNewDateTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="field"
                    placeholderText={t('session.select_date')}
                />
            </div>

            <button onClick={handleSave} className='field'>
                {t('buttons.save')}
            </button>
        </Modal>
    );
};

export default EditSessionDate;
