import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { Workbook, Client } from '../../../../../types/types';
import { withTranslation, WithTranslation } from "react-i18next";
import ShowTrainings from './ShowTrainings';
import Spinner from '../../../../../common/Spinner';
import { useGetWorkbooksByUserId } from '../../../../../services/workbooks/WorkbooksTanstackService';

interface GetTrainingsProps extends WithTranslation {
  client: Client;
}

const IndividualTrainings: React.FC<GetTrainingsProps> = ({ client, t }) => {
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const userId = client.userId ?? 0;
  const { data: workbooks = [], isLoading, isFetching } = useGetWorkbooksByUserId(userId, !!client.userId);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    setTimeoutReached(false);

    timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [client.userId]);

  useEffect(() => {
    const lastActiveTabIndex = localStorage.getItem('lastActiveTabIndex');
    if (lastActiveTabIndex !== null) {
      setActiveTabIndex(parseInt(lastActiveTabIndex));
    }
  }, []);

  const handleTabSelect = (index: number) => {
    setActiveTabIndex(index);
    localStorage.setItem('lastActiveTabIndex', index.toString());
  };

  if ((isLoading || isFetching) && !timeoutReached) {
    return <Spinner />;
  }

  if ((timeoutReached && workbooks.length === 0) || (!(isLoading || isFetching) && workbooks.length === 0)) {
    return <p>No individual trainings found for client.</p>;
  }

  return (
    <div>
      <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
        <TabList>
          {workbooks.map((workbook: Workbook) => (
            <Tab key={workbook.id}>{workbook.name}</Tab>
          ))}
        </TabList>
        {workbooks.map((workbook: Workbook) => (
          <TabPanel key={workbook.id}>
            <ShowTrainings workbook_id={workbook.id} userId={client.userId} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default withTranslation("global")(IndividualTrainings);
