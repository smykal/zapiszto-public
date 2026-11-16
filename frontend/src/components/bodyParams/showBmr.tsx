import React from "react";
import { withTranslation } from "react-i18next";
import { BmrType } from "../../types/types";
import Spinner from "../../common/Spinner";
import { useGetBmr } from "../../services/bodyParams/BodyParamsTanstackService";

const GetBmr: React.FC<{ t: any }> = ({ t }) => {
        const { data: bmrList = [], isLoading, isError } = useGetBmr();

        if (isLoading) {
            return <Spinner />;
        }

        if (isError || bmrList.length === 0) {
            return <p>{t("body_params.basal_metabolic_rate_no_data")}</p>;
        }

        const date = bmrList[0]?.insert_date ?? null;

        return (
            <div>
                {date && <p>{t("body_params.bmr_values_calculated_for")} {date}</p>}
                <br />

                <table className="fixed-table">
                    <thead>
                        <tr>
                            <th className="column-medium">{t("description")}</th>
                            <th className="column-medium">{t("bmr")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bmrList.map((bmr: BmrType, index: number) => (
                            <tr key={index}>
                                <td className="column-medium">{bmr.category}</td>
                                <td className="column-medium">{bmr.bmr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
};

export default withTranslation("global")(GetBmr);
