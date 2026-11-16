import React from "react";
import { withTranslation } from "react-i18next";
import { BmiItem } from "../../types/types";

type Props = {
  t: any;
  bmiList: BmiItem[] | null;
};

const ShowBmi: React.FC<Props> = ({ t, bmiList }) => {
  if (!bmiList || bmiList.length === 0) {
    return <span className="loader" />;
  } else {
    return (
      <table className="fixed-table">
      <thead>
        <tr>
          <th className="column-medium">{t("table.date")}</th>
          <th className="column-medium">{t("table.weight")}</th>
          <th className="column-medium">{t("table.bmi_value")}</th>
          <th className="column-medium">{t("table.description")}</th>
        </tr>
      </thead>
      <tbody>
        {bmiList.map((bmi, index) => (
          <tr key={index}>
            <td className="column-medium">{bmi.date}</td>
            <td className="column-medium">{bmi.weight}</td>
            <td className="column-medium">{bmi.value}</td>
            <td className="column-medium">{bmi.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
    );
  }
};

export default withTranslation("global")(ShowBmi);
