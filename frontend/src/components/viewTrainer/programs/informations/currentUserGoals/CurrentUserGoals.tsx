import React from 'react';
import { GoalDetailsDto } from '../../../../../types/types';
import { useTranslation } from "react-i18next";
import Spinner from '../../../../../common/Spinner';
import { useGetGoalDetails } from '../../../../../services/goals/GoalsTanstackService';

type CurrentUserGoalsProps = {
  clientId: string;
};

const CurrentUserGoals: React.FC<CurrentUserGoalsProps> = ({ clientId }) => {
  const { t } = useTranslation("global");
  const { data: goals = [], isLoading: loading } = useGetGoalDetails(clientId);

  if (loading) return <Spinner />;

  // 🔍 Filtrowanie faktycznych danych (niepuste rekordy)
  const validGoals = (goals as GoalDetailsDto[]).filter(goal =>
    goal.bodyParamName || goal.bodyTestName || goal.unitName || goal.action || goal.value
  );

  if (validGoals.length === 0) return null;

  return (
    <div style={{
      overflowX: "auto",
      overflowY: "hidden",
      marginTop: "20px"
    }}>
      <table
        className="fixed-table">
        <thead>
          <tr>
            <th className="column-small">{t("table.body_param")}</th>
            <th className="column-medium">{t("table.body_test")}</th>
            <th className="column-medium">{t("table.unit")}</th>
            <th className="column-medium">{t("table.action")}</th>
            <th className="column-medium">{t("table.value")}</th>
          </tr>
        </thead>
        <tbody>
          {validGoals.map(goal => (
            <tr key={goal.clientId} style={{ borderBottom: '1px solid #ddd' }}>
              <td className="column-medium">{goal.bodyParamName || '-'}</td>
              <td className="column-medium">{goal.bodyTestName || '-'}</td>
              <td className="column-medium">{goal.unitName || '-'}</td>
              <td className="column-medium">{goal.action || '-'}</td>
              <td className="column-medium">{goal.value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentUserGoals;
