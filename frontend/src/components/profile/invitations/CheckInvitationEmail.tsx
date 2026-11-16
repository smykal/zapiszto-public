// CheckInvitationEmail.tsx
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Service from '../../../services/invitations/';
import { NewInvitation } from '../../../types/types';

interface CheckInvitationEmailProps {
    email: string;
    setEmail: (value: string) => void;
    onValid: () => void;
}

const CheckInvitationEmail: React.FC<CheckInvitationEmailProps> = ({ email, setEmail, onValid }) => {
    const { t } = useTranslation('global');
    const [checkResult, setCheckResult] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = () => {
        setLoading(true);
        const request: NewInvitation = { email };
        Service.checkInvitation(request)
            .then(result => {
                setCheckResult(result);
                if (result) {
                    onValid();
                }
            })
            .catch(() => setCheckResult(false))
            .finally(() => setLoading(false));
    };

    return (
        <div className="check-invitation-box">
            <input
                type="email"
                placeholder={t("buttons.placeholder_send_invitation")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-field"
            />
            <button 
                onClick={handleCheck} 
                className="width_15rem"
                disabled={loading || !email}>
                {t("invitations.check_invitation")}
            </button>
            {checkResult !== null && (
                <div style={{ color: checkResult ? 'green' : 'red' }}>
                    {checkResult
                        ? t("invitations.valid_address")
                        : t("invitations.invalid_address")}
                </div>
            )}
        </div>
    );
};

export default CheckInvitationEmail;
