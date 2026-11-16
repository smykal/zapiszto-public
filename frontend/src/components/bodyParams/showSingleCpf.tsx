import React, { Component } from "react";
import { CpfType } from "../../types/types";
import { withTranslation } from "react-i18next";

type Props = {
  param_name: CpfType;
  cpfType: CpfType[];
  t: any;
};

type State = {};

class ShowSingleCpf extends Component<Props, State> {
  render() {
    const { param_name } = this.props;
    const { t } = this.props;

    return (
      <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
        <thead>
          <tr>
            <th>{t("body_params.parameter")}</th>
            <th>{t("body_params.minimal")}</th>
            <th>{t("body_params.maximal")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("body_params.kcal")}</td>
            <td>{param_name.kcalMin} {t("body_params.kcal")}</td>
            <td>{param_name.kcalMax} {t("body_params.kcal")}</td>
          </tr>
          <tr>
            <td>{t("body_params.carbs")}</td>
            <td>{param_name.carbohydrateMin} {t("body_params.gram")}</td>
            <td>{param_name.carbohydrateMax} {t("body_params.gram")}</td>
          </tr>
          <tr>
            <td>{t("body_params.protein")}</td>
            <td>{param_name.proteinMin} {t("body_params.gram")}</td>
            <td>{param_name.proteinMax} {t("body_params.gram")}</td>
          </tr>
          <tr>
            <td>{t("body_params.fat")}</td>
            <td>{param_name.fatMin} {t("body_params.gram")}</td>
            <td>{param_name.fatMax} {t("body_params.gram")}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default withTranslation("global")(ShowSingleCpf)
