import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, ClientBodyTest } from '../../../../../types/types';
import Options from './options/Options';
import { useGetClientBodyTest } from '../../../../../services/bodyTests/ClientBodyTestsTanstackService';

interface GetClientBodyTestProps {
    client: Client;
    bodyTests: ClientBodyTest[];
    setBodyTests: React.Dispatch<React.SetStateAction<ClientBodyTest[]>>;
}

const GetClientBodyTest: React.FC<GetClientBodyTestProps> = ({ client, bodyTests, setBodyTests }) => {
    const { t } = useTranslation('global');
    const { data, isLoading } = useGetClientBodyTest(client.id);

    useEffect(() => {
        if (data) {
            setBodyTests(data);
        }
    }, [data, setBodyTests]);

    if (isLoading) {
        return <div>{t('loading')}</div>;
    }

    const handleDelete = (id: string) => {
        setBodyTests(prev => prev.filter(test => test.id !== id));
    };

    const handleEdit = (updatedTest: ClientBodyTest) => {
        setBodyTests(prev =>
            prev.map(test => test.id === updatedTest.id ? updatedTest : test)
        );
    };

    return (
        <div style={{
            overflowX: "auto",
            overflowY: "hidden"
        }}>
            {bodyTests.length === 0 ? (<></>) : (
                <table>
                    <thead>
                        <tr>
                            <th className="column-large">{t("table.name")}</th>
                            <th className="column-large">{t("table.description")}</th>
                            <th className="column-large">{t("table.result")}</th>
                            <th className="column-large">{t("table.purpose")}</th>
                            <th className="column-medium">{t("table.options")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bodyTests.map(test => (
                            <tr key={test.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td className="column-large">{test.name}</td>
                                <td className="column-large">{test.description}</td>
                                <td className="column-large">{test.result}</td>
                                <td className="column-large">{test.purpose}</td>
                                <td className="column-medium">
                                    <Options
                                        test={test}
                                        clientId={client.id}
                                        onTestOptionEdit={handleEdit}
                                        onTestOptionDelete={handleDelete}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GetClientBodyTest;
