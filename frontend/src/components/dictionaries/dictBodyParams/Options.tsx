import React from "react";
import DictBodyParamsService from "../../../services/dict/DictBodyParamsService";
import { withTranslation } from "react-i18next";

type Props = {
    item: number;
    onDeleteBodyParam: (bodyParamId: number) => void;
    onEditBodyParam: (bodyParamId: number) => void;
    t: any;
};

const Options: React.FC<Props> = ({ item, onDeleteBodyParam, onEditBodyParam, t }) => {
    const deleteBodyParam = (bodyParamId: number) => {
        DictBodyParamsService.deleteDictBodyParam(bodyParamId)
            .then(() => {
                onDeleteBodyParam(bodyParamId);
            })
            .catch(error => {
                console.error('Error deleting body parameter:', error);
            });
    }

    return (
        <div>
            <label htmlFor={t("buttons.delete")} className="icon-option">
                <img src="/images/navigation/bin.svg" onClick={() => deleteBodyParam(item)} />
            </label>

            <label htmlFor={t("buttons.edit")} className="icon-option">
                <img src="/images/navigation/edit.svg" onClick={() => onEditBodyParam(item)} />
            </label>
        </div>
    );
}

export default withTranslation("global")(Options);
