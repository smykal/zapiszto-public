import React, { useState } from 'react';
import { useGetDictTagsCategory } from '../../../services/dict/DictTagsCategoryTanstackService';
import AddDictTagsCategory from './AddDictTagsCategory';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = WithTranslation;

const ShowDictTagsCategory: React.FC<Props> = ({ t }) => {
    const { data: dictTagsCategories = [] } = useGetDictTagsCategory();
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddCategory = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <button onClick={() => setModalVisible(true)}>{t("buttons.add_category")}</button>
            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.id")}</th>
                        <th>{t("table.name")}</th>
                    </tr>
                </thead>
                <tbody>
                    {dictTagsCategories.map((category: any) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalVisible && (
                <AddDictTagsCategory
                    dictTagsCategory={dictTagsCategories}
                    onAddCategory={handleAddCategory}
                />
            )}
        </div>
    );
};

export default withTranslation("global")(ShowDictTagsCategory);