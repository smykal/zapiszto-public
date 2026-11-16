import React, { useState, useEffect } from "react";
import { DictBodyTest } from "../../../types/types";
import DictBodyTestService from '../../../services/dict/DictBodyTestService';
import AddDictBodyTestPerUser from "./AddDictBodyTest";
import Options from "./Options";
import LanguageModal from "./LanguageModal";
import { useTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

const ShowDictBodyTest: React.FC = () => {
    const [dictBodyTests, setDictBodyTests] = useState<DictBodyTest[]>([]);
    const [showBasic, setShowBasic] = useState(true);
    const [showPerUser, setShowPerUser] = useState(true);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const [modalLanguageVisible, setModalLanguageVisible] = useState(false);
    const [selectedBodyTestId, setSelectedBodyTestId] = useState<string | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        loadDictBodyTests();
    }, []);

    const loadDictBodyTests = () => {
        DictBodyTestService.getDictBodyTest()
            .then(response => {
                setDictBodyTests(response.data);
            })
            .catch(error => {
                console.error('Error loading dict body tests:', error);
            });
    };

    const handleAddBodyTest = (newBodyTest: DictBodyTest) => {
        setDictBodyTests(prevBodyTests => [...prevBodyTests, newBodyTest]);
        setModalAddItemVisible(false);
    };

    const handleDeleteBodyTest = (bodyTestId: string) => {
        setDictBodyTests(prevBodyTests => prevBodyTests.filter(bodyTest => bodyTest.dict_id !== bodyTestId));
    };

    const handleEditBodyTest = (bodyTestId: string, dict: string) => {
        setSelectedBodyTestId(bodyTestId);
        setModalLanguageVisible(true);
    };

    const handleShowBasicChange = () => {
        setShowBasic(!showBasic);
    };

    const handleShowPerUserChange = () => {
        setShowPerUser(!showPerUser);
    };

    const filteredBodyTests = dictBodyTests.filter(bodyTest => {
        if (showBasic && bodyTest.dict === "BASIC") return true;
        if (showPerUser && bodyTest.dict === "PER_USER") return true;
        return false;
    });

    return (
        <div>
            <div  style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={showBasic}
                        onChange={handleShowBasicChange}
                    />
                    {t('dictionaries.basic')}
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showPerUser}
                        onChange={handleShowPerUserChange}
                    />
                    {t('dictionaries.per_user')}
                </label>
            </div>
            <button onClick={() => setModalAddItemVisible(true)} className="field">
                {t("buttons.add_body_test")}
            </button>

            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                        <th>{t("table.purpose")}</th>
                        <th>{t("table.options")}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBodyTests.map((row) => (
                        <tr key={row.id}>
                            <td style={{
                                cursor: row.dict === "PER_USER" ? 'pointer' : 'default',
                                color: row.dict === "PER_USER" ? 'inherit' : 'var(--color03)',
                            }}>{row.name}</td>
                            <td style={{
                                cursor: row.dict === "PER_USER" ? 'pointer' : 'default',
                                color: row.dict === "PER_USER" ? 'inherit' : 'var(--color03)',
                            }}>{row.description}</td>
                            <td style={{
                                cursor: row.dict === "PER_USER" ? 'pointer' : 'default',
                                color: row.dict === "PER_USER" ? 'inherit' : 'var(--color03)',
                            }}>{row.purpose}</td>
                            <td style={{
                                cursor: row.dict === "PER_USER" ? 'pointer' : 'default',
                                color: row.dict === "PER_USER" ? 'inherit' : 'var(--color03)',
                            }}>
                                {row.dict === "PER_USER" ? (
                                    <Options
                                        item={row.dict_id}
                                        dict={row.dict}
                                        onDeleteBodyTest={handleDeleteBodyTest}
                                        onEditBodyTest={handleEditBodyTest}
                                    />
                                ) : (
                                    <img
                                        src="/images/navigation/options.svg"
                                        alt="Options"
                                        className="options-icon disabled"
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add")}>
                <AddDictBodyTestPerUser dictBodyTests={dictBodyTests} onAddBodyTest={handleAddBodyTest} />
            </Modal>
            <LanguageModal
                show={modalLanguageVisible}
                onClose={() => setModalLanguageVisible(false)}
                bodyTestId={selectedBodyTestId!}
            />
        </div>
    );
};

export default ShowDictBodyTest;
