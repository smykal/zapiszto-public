import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BodyParamsItem } from '../../../../../types/types';
import Options from '../../../../bodyParams/bodyParam/Options'
import { useTranslation } from 'react-i18next';

interface DisplayBodyParamsProps {
    param_name: string;
    userId: number;
    allBodyParams: BodyParamsItem[];
    refresh: () => void;
}

const DisplayBodyParamsByUserId: React.FC<DisplayBodyParamsProps> = ({ param_name, allBodyParams , refresh}) => {
    const { t } = useTranslation('global');

    // Filtruj i przetwórz dane
    const filteredParams = useMemo(() => {
        return allBodyParams
            .filter(item => item.dict_body_params_name === param_name)
            .map(item => ({
                ...item,
                insert_date: new Date(item.insert_date).toISOString().split('T')[0],
            }))
            .sort((a, b) => new Date(a.insert_date).getTime() - new Date(b.insert_date).getTime());
    }, [allBodyParams, param_name]);

    const chartData = filteredParams.map(item => ({
        insert_date: item.insert_date,
        [param_name]: item.value,
    }));

    const randomColor = useMemo(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="column-medium">{t('table.date')}</th>
                        <th className="column-medium">{t('table.value')}</th>
                        <th className="column-medium">{t('table.created_by')}</th>
                        <th className="column-medium">{t('table.options')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParams.map((item, index) => (
                        <tr key={index}>
                            <td className="column-medium">{item.insert_date}</td>
                            <td className="column-medium">{item.value}</td>
                            <td className="column-medium">{item.createdBy}</td>
                            <td className="column-medium">
                                <Options
                                    item={item}
                                    onDelete={(id) => {
                                        refresh(); 
                                    }}
                                    onUpdate={() => {
                                        refresh();
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ResponsiveContainer width={300} height={200}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="insert_date"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis type="number" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={param_name}
                        stroke={randomColor}
                        strokeWidth={2}
                        connectNulls={true}
                        dot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DisplayBodyParamsByUserId;
