import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { withTranslation, WithTranslation } from 'react-i18next'; // Import WithTranslation
import { useQueryClient } from '@tanstack/react-query';
import BodyPhotos from './bodyPhotos/BodyPhotos';
import PutBodyParam from './putBodyParam';
import ShowBodyParams from './showBodyParams';
import ShowDiagram from './showDiagramAll';
import {
  useGetActualBodyParams,
  useGetAllBodyParams,
  useGetAge,
  useGetBmiParams,
  useGetGender,
} from '../../services/bodyParams/BodyParamsTanstackService';

const BodyParams: React.FC<WithTranslation> = ({ t }) => {
  const queryClient = useQueryClient();
  const { data: bodyParams } = useGetActualBodyParams();
  const { data: allBodyParams = [] } = useGetAllBodyParams();
  const { data: genderData } = useGetGender();
  const { data: ageData } = useGetAge();
  const { data: bmiData } = useGetBmiParams();
  const gender = genderData?.gender ?? null;
  const age = ageData?.age ?? null;

  const updateData = () => {
    queryClient.invalidateQueries({ queryKey: ['bodyParams'] });
  };

  const bmi = Array.isArray(bmiData)
    ? bmiData.map(item => ({
        ...item,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : null,
      }))
    : [];

  return (
    <div className="card-container">
      <Tabs>
        <TabList>
          <Tab>{t("body_params.body_params")}</Tab>
          <Tab>{t("body_params.body_photos")}</Tab>
        </TabList>
        <TabPanel>
          <PutBodyParam clientId={null} updateData={updateData} />
          <ShowBodyParams
            bodyParams={bodyParams}
            gender={gender}
            age={age}
            bmi={bmi}
            updateData={updateData}
          />
          <ShowDiagram allBodyParams={allBodyParams} />
        </TabPanel>
        <TabPanel>
          <BodyPhotos />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default withTranslation('global')(BodyParams);

