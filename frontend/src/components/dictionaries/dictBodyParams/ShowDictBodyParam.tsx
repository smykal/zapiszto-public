import React, { useEffect, useState } from "react";
import { DictBodyParam } from "../../../types/types";
import { useGetDictBodyParams } from '../../../services/bodyParams/BodyParamsTanstackService';
import AddDictBodyParam from "./AddDictBodyParam";
import Options from "./Options";
import LanguageModal from "./LanguageModal";
import { useTranslation } from "react-i18next";

const ShowDictBodyParam: React.FC = () => {
    const [dictBodyParams, setDictBodyParams] = useState<DictBodyParam[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBodyParamId, setSelectedBodyParamId] = useState<number | null>(null);
    const { t } = useTranslation("global");
    const { data: fetchedBodyParams = [] } = useGetDictBodyParams();

    useEffect(() => {
        setDictBodyParams(fetchedBodyParams);
    }, [fetchedBodyParams]);

    const handleAddBodyParam = (newBodyParam: DictBodyParam) => {
        setDictBodyParams(prevBodyParams => [...prevBodyParams, newBodyParam]);
    };

    const handleDeleteBodyParam = (bodyParamId: number) => {
        setDictBodyParams(prevBodyParams => prevBodyParams.filter(param => param.id !== bodyParamId));
    };

    const handleEditBodyParam = (id: number) => {
        setSelectedBodyParamId(id);
        setModalVisible(true);
    };

    return (
        <div>
            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                        <th>{t("table.options")}</th>
                    </tr>
                </thead>
                <tbody>
                    {dictBodyParams.map((row) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.description}</td>
                            <td>
                                <Options item={row.id} onDeleteBodyParam={handleDeleteBodyParam} onEditBodyParam={handleEditBodyParam} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddDictBodyParam dictBodyParams={dictBodyParams} onAddBodyParam={handleAddBodyParam} />
            <LanguageModal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                bodyParamId={selectedBodyParamId!}
            />
        </div>
    );
};

export default ShowDictBodyParam;
