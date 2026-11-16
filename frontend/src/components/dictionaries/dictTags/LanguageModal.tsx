import React, { useEffect, useState } from 'react';
import { useGetDictTagDetails, useUpdateDictTagTranslations } from '../../../services/dict/DictTagsTanstackService';
import { withTranslation } from 'react-i18next';
import Modal from '../../../constants/Modal';

type Props = {
    show: boolean;
    onClose: () => void;
    tagId: string;
    t: any;
};

const LanguageModal: React.FC<Props> = ({ show, onClose, tagId, t }) => {
    const { data: tagData } = useGetDictTagDetails(tagId);

    const [localTagData, setLocalTagData] = useState<any>(null);

    useEffect(() => {
        if (tagData) {
            setLocalTagData(tagData);
        }
    }, [tagData]);

    const updateTranslationsMutation = useUpdateDictTagTranslations();

    const handleModalClose = () => {
    if (!localTagData) {
        onClose();
        return;
    }

    updateTranslationsMutation.mutate(localTagData, {
        onSuccess: () => {
            onClose();
        },
        onError: (error) => {
            console.error(error);
        }
    });
};

    return (
        <Modal show={show} onClose={handleModalClose} title={t("tags.details")}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t("table.language")}</th>
                        <th>{t("table.name")}</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render rows for each language */}
                </tbody>
            </table>
        </Modal>
    );
};

export default withTranslation("global")(LanguageModal);