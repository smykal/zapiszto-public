import React, { useState } from 'react';
import AddDictTags from './AddDictTags';
import LanguageModal from './LanguageModal';
import Options from './Options';
import { withTranslation } from 'react-i18next';
import { DictTagsDto } from '../../../types/types';
import { useGetDictTags } from '../../../services/dict/DictTagsTanstackService';

type Props = {
    t: any;
};

const ShowDictTags: React.FC<Props> = ({ t }) => {
    const { data: dictTags = [], isLoading, isError } = useGetDictTags();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

    const handleEditTag = (tagId: string) => {
        setSelectedTagId(tagId);
    };

    if (isLoading) {
        return <div>{t("loading")}</div>;
    }

    if (isError) {
        return <div>{t("error")}</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>{t("table.id")}</th>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                        <th>{t("table.actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {dictTags.map((tag: DictTagsDto) => (
                        <tr key={tag.id}>
                            <td>{tag.id}</td>
                            <td>{tag.name}</td>
                            <td>{tag.description}</td>
                            <td>
                                <Options
                                    item={tag}
                                    onEditTag={handleEditTag}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => setModalVisible(true)}>
                {t("buttons.add")}
            </button>

            {modalVisible && (
                <AddDictTags
                    dictTags={dictTags}
                    onClose={() => setModalVisible(false)}
                />
            )}

            {selectedTagId && (
                <LanguageModal
                    show={!!selectedTagId}
                    onClose={() => setSelectedTagId(null)}
                    tagId={selectedTagId}
                />
            )}
        </div>
    );
};

export default withTranslation("global")(ShowDictTags);