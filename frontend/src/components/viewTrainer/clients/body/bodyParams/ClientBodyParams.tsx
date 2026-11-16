import React from 'react';
import { useTranslation } from 'react-i18next';
import { Client, BodyParamsItem } from '../../../../../types/types';
import {
    useGetActualBodyParamsByClientId,
    useGetActualBodyParamsByUserId,
    useGetAllBodyParamsByClientId,
    useGetAllBodyParamsByUserId,
} from '../../../../../services/bodyParams/BodyParamsTanstackService';
import DisplayBodyParamsByUserId from './DisplayBodyParamsByUserId';
import Collapsible from 'react-collapsible';
import PutBodyParam from '../../../../bodyParams/putBodyParam';

interface ClientDetailsProps {
    client?: Client; // Użyj opcjonalnego typu
}

const ClientBodyParams: React.FC<ClientDetailsProps> = ({ client }) => {
    const { t } = useTranslation('global');
    const userId = client?.userId ?? 0;
    const clientId = client?.id ?? '';
    const hasUser = userId > 0;
    const hasClient = Boolean(clientId);
    const actualByUser = useGetActualBodyParamsByUserId(userId, hasUser);
    const actualByClient = useGetActualBodyParamsByClientId(clientId, !hasUser && hasClient);
    const allByUser = useGetAllBodyParamsByUserId(userId, hasUser);
    const allByClient = useGetAllBodyParamsByClientId(clientId, !hasUser && hasClient);
    const bodyParams: BodyParamsItem[] = (actualByUser.data ?? actualByClient.data ?? []);
    const allBodyParams: BodyParamsItem[] = (allByUser.data ?? allByClient.data ?? []);
    const isLoading = actualByUser.isLoading || actualByClient.isLoading || allByUser.isLoading || allByClient.isLoading;

    const refreshAllBodyParams = () => {
        void (hasUser ? allByUser.refetch() : allByClient.refetch());
    };

    const refreshData = () => {
        void (hasUser ? actualByUser.refetch() : actualByClient.refetch());
        refreshAllBodyParams();
    };

    if (!client) {
        return <div>{t('client_not_set')}</div>;
    }

    if (isLoading) {
        return <span className='loader' />;
    }

    return (
        <div>
            <ul>
                {Array.isArray(bodyParams) && bodyParams.map((item: BodyParamsItem, index: number) => (
                    <li key={index} id="bodyParams">
                        <Collapsible
                            trigger={
                                <div className="collapsible-element">
                                    <span>{item.dict_body_params_name}: {item.value}</span>
                                </div>
                            }
                        >
                            <DisplayBodyParamsByUserId
                                param_name={item.dict_body_params_name}
                                userId={client.userId}
                                allBodyParams={allBodyParams}
                                refresh={refreshAllBodyParams}
                            />
                        </Collapsible>
                    </li>
                ))}
                <PutBodyParam
                    clientId={client.id}
                    updateData={refreshData}
                />
            </ul>
        </div>
    );
};

export default ClientBodyParams;
