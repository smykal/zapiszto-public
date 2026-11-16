// SendInvitation.tsx
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Modal from '../../../constants/Modal';
import CheckInvitationEmail from './CheckInvitationEmail';
import SendInvitationForm from './SendInvitationForm';

const SendInvitation: React.FC<{ refreshInvitations: () => void }> = ({ refreshInvitations }) => {
    const { t } = useTranslation('global');
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);

    const openModal = () => {
        setShowModal(true);
        setEmail('');
        setEmailValid(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='center'>
            <button
                onClick={openModal}
                className="width_15rem">
                {t("buttons.send_invitation")}
            </button>

            <Modal show={showModal} onClose={closeModal} title={t("invitations.send_invitation")}>
                <p>{t("invitations.instruction")}</p>

                <CheckInvitationEmail
                    email={email}
                    setEmail={setEmail}
                    onValid={() => setEmailValid(true)}
                />

                <SendInvitationForm
                    initialEmail={emailValid ? email : ''}
                    onSuccess={refreshInvitations}
                />
            </Modal>
        </div>
    );
};

export default SendInvitation;
