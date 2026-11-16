import React from "react";
import { useTranslation } from "react-i18next";
import { Goal } from "../../../../types/types";
import Options from "./options/Options";


interface Props {
  goals: Goal[];
  onGoalUpdated: () => void;
  onGoalDeleted: () => void;
}

const GetGoals: React.FC<Props> = ({ goals, onGoalUpdated, onGoalDeleted }) => {
  const { t } = useTranslation("global");

    return (
        <div style={{
            overflowX: "auto",
            overflowY: "hidden"
        }}>
            {goals.length === 0 ? (<></>) : (
                <table className="fixed-table">
                    <thead>
                        <tr>
                            <th className="column-medium">{t("clients.goals")}</th>
                            <th className="column-medium">{t("table.unit")}</th>
                            <th className="column-medium">{t("table.action")}</th>
                            <th className="column-medium">{t("table.value")}</th>
                            <th className="column-medium">{t("table.goal_date")}</th>
                            <th className="column-medium">{t("table.insert_date")}</th>
                            <th className="column-small">{t("table.options")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.map((goal) => (
                            <tr key={goal.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td className="column-medium">{goal.dictBodyParam}{goal.dictBodyTest}</td>
                                <td className="column-medium">{goal.dictUnit}</td>
                                <td className="column-medium">{goal.action}</td>
                                <td className="column-medium">{goal.value}</td>
                                <td className="column-medium">{new Date(goal.goalDate).toLocaleDateString()}</td>
                                <td className="column-medium">{new Date(goal.insertDate).toLocaleDateString()}</td>
                                <td className="column-small"><Options
                                    goal={goal}
                                    onGoalUpdated={onGoalUpdated}
                                    onGoalDeleted={onGoalDeleted}
                                /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GetGoals;