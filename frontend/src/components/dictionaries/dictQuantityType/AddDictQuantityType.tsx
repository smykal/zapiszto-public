import React, { useState } from "react";
import { DictQuantityType, NewDictQuantityType } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DictQuantityTypeService from '../../../services/dict/DictQuantityTypeService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictQuantityTypes: DictQuantityType[];
    onAddQuantityType: (newQuantityType: DictQuantityType) => void;
    t: any;
};

const AddDictQuantityType: React.FC<Props> = ({ dictQuantityTypes, onAddQuantityType, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const postDictQuantityType = (values: { newDictQuantityTypeName: string, newDictQuantityTypeShortcut: string }) => {
        const newDictQuantityType: NewDictQuantityType = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.newDictQuantityTypeName },
            shortcut: { [selectedLanguage]: values.newDictQuantityTypeShortcut }
        };
        DictQuantityTypeService.postDictQuantityTypePerUser(newDictQuantityType)
            .then(response => {
                const addedQuantityType: DictQuantityType = {
                    id: crypto.randomUUID(),
                    dict: "PER_USER",
                    dict_id: newDictQuantityType.id,
                    name: values.newDictQuantityTypeName,
                    shortcut: values.newDictQuantityTypeShortcut
                };
                onAddQuantityType(addedQuantityType);
            })
            .catch(error => {
                console.error('Error adding quantity type:', error);
            });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictQuantityTypeName: '',
                    newDictQuantityTypeShortcut: ''
                }}
                validationSchema={Yup.object({
                    newDictQuantityTypeName: Yup.string()
                        .required(t("validation.this_field_is_required")),
                    newDictQuantityTypeShortcut: Yup.string()
                        .required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictQuantityType(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div>
                            <div>
                                <label htmlFor="language">
                                    <select
                                        id="language"
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="field"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div>
                                <ErrorMessage name="newDictQuantityTypeName" component="div" className="error" />
                                <Field name="newDictQuantityTypeName" type="text" className="field" placeholder={t("table.name")} />
                            </div>

                            <div>
                                <ErrorMessage name="newDictQuantityTypeShortcut" component="div" className="error" />
                                <Field name="newDictQuantityTypeShortcut" type="text" className="field" placeholder={t("table.shortcut")} />
                            </div>

                            <button type="submit" disabled={formik.isSubmitting} className="field">{t("buttons.add")}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictQuantityType);
