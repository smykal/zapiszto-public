import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../constants/Modal';
import Instagram from '../../home/contact/instagram';

interface Props {
    mail?: string | null;
    www?: string | null;
    phone?: string | null;
    instagram?: string | null;
}

type ContactType = 'mail' | 'www' | 'phone' | 'instagram';

const CardContactView: React.FC<Props> = ({ mail, www, phone, instagram }) => {
    const { t } = useTranslation('global');
    const [activeModal, setActiveModal] = useState<ContactType | null>(null);

    const openModal = (type: ContactType) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    const renderModalContent = () => {
        if (!activeModal) return null;

        const valueMap: Record<ContactType, React.ReactNode> = {
            mail,
            www,
            phone,
            instagram: <Instagram username={instagram ?? ''} />
        };

        const value = valueMap[activeModal] ?? t('cards.not_available') ?? 'Brak danych';

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <div style={{ fontSize: 14, wordBreak: 'break-all' }}>{value}</div>
            </div>
        );
    };

    const contactItems = [
        mail && {
            type: 'mail' as ContactType,
            icon: '/images/mail/envelope_color.svg',
            label: mail,
        },
        www && {
            type: 'www' as ContactType,
            icon: '/images/www/www_color.svg',
            label: www,
        },
        phone && {
            type: 'phone' as ContactType,
            icon: '/images/phone/phone_color.svg',
            label: phone,
        },
        instagram && {
            type: 'instagram' as ContactType,
            icon: '/images/instagram/Instagram_Glyph_Gradient.svg',
            label: `@${instagram}`,
        },
    ].filter(Boolean) as {
        type: ContactType;
        icon: string;
        label: string;
    }[];


    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                {contactItems.map((item) => (
                    <button
                        key={item.type}
                        type="button"
                        onClick={() => openModal(item.type)}
                        className="icon-button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color02)',
                        }}
                    >
                        <img src={item.icon} alt={item.type || ''} style={{ width: 24, height: 24 }} />
                        {/* <span style={{ fontSize: 14 }}>{item.label}</span> */}
                    </button>
                ))}
            </div>

            <Modal
                show={!!activeModal}
                onClose={closeModal}
                title={
                    activeModal
                        ? {
                            mail: t('cards.mail') ?? 'E-mail',
                            www: t('cards.www') ?? 'Strona WWW',
                            phone: t('cards.phone') ?? 'Telefon',
                            instagram: t('cards.instagram') ?? 'Instagram',
                        }[activeModal]
                        : ''
                }
            >
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default CardContactView;
