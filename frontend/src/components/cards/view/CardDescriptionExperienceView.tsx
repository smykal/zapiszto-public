import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    description?: string | null;
    experience?: string | null;
}

const CardDescriptionExperienceView: React.FC<Props> = ({ description, experience }) => {
    const { t } = useTranslation('global');

    const displayDescription =
        description && description.trim() !== ''
            ? description
            : t('cards.description_placeholder') ?? 'Brak opisu';

    const displayExperience =
        experience && experience.trim() !== ''
            ? experience
            : t('cards.experience_placeholder') ?? 'Brak doświadczenia';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
            <div
                style={{
                    fontSize: 14,
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5,
                }}
            >
                {displayDescription}
            </div>
            <div
                style={{
                    fontSize: 14,
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5,
                }}
            >
                {displayExperience}
            </div>
        </div>
    );
};

export default CardDescriptionExperienceView;
