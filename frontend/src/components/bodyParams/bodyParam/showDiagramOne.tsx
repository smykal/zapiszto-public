import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BodyParamsItem } from '../../../types/types';
import { withTranslation } from "react-i18next";
import Options from './Options';
import Spinner from '../../../common/Spinner';
import { useGetAllBodyParams } from '../../../services/bodyParams/BodyParamsTanstackService';

const DisplayBodyParams: React.FC<{ param_name: string; t: any }> = ({ param_name, t }) => {
        const { data: fetchedBodyParams = [], isLoading, isError, refetch } = useGetAllBodyParams();

        if (isLoading) {
            return <Spinner />;
        }

        if (isError) {
            return <p>Błąd pobierania parametrów ciała.</p>;
        }

        const bodyParams = fetchedBodyParams
            .map((item: BodyParamsItem) => ({
                ...item,
                insert_date: new Date(item.insert_date).toISOString().split('T')[0],
            }))
            .sort(
                (a: BodyParamsItem, b: BodyParamsItem) =>
                    new Date(a.insert_date).getTime() - new Date(b.insert_date).getTime()
            );


        // Filtruj dane przed wyświetleniem
        const filteredParams = bodyParams.filter(
            (item: BodyParamsItem) => item.dict_body_params_name === param_name
        );

        // Przygotuj dane dla wykresu
        const chartData = filteredParams.map((item: BodyParamsItem) => ({
            insert_date: item.insert_date,
            value: item.value,
            [param_name]: item.value, // Tworzy dynamiczny klucz zgodny z param_name
        }));

        return (
            <div >
                <div>
                    <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                        <thead>
                            <tr>
                                <th>{t("table.date")}</th>
                                <th>{t("table.value")}</th>
                                <th>{t("table.created_by")}</th>
                                <th> {t("table.options")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParams.map((item: BodyParamsItem, index: number) => (
                                <tr key={index}>
                                    <td>{item.insert_date}</td>
                                    <td>{item.value}</td>
                                    <td>{item.createdBy}</td>
                                    <td>
                                        <Options item={item} onDelete={() => {
                                            refetch();
                                        }} onUpdate={() => {        
                                            refetch();
                                        }} />   
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width={300} height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="insert_date"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis type="number" domain={['chartData.values - 200', 'chartData.values + 200']} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={param_name}
                                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                strokeWidth={2}
                                connectNulls={true}
                                dot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
};

export default withTranslation("global")(DisplayBodyParams);
