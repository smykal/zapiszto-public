import React, { useState } from "react";
import { DictBodyParam, NewDictBodyParam } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DictBodyParamsService from '../../../services/dict/DictBodyParamsService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictBodyParams: DictBodyParam[];
    onAddBodyParam: (newBodyParam: DictBodyParam) => void;
    t: any;
};

const AddDictBodyParam: React.FC<Props> = ({ dictBodyParams, onAddBodyParam, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].code);

    const postDictBodyParam = (values: { newDictBodyParamName: string, newDictBodyParamDescription: string }) => {
        const isNameExisting = dictBodyParams.some(param => param.name === values.newDictBodyParamName);
        if (!isNameExisting) {
            const newDictBodyParam: NewDictBodyParam = {
                name: { [selectedLanguage]: values.newDictBodyParamName },
                description: { [selectedLanguage]: values.newDictBodyParamDescription }
            };
            DictBodyParamsService.postDictBodyParam(newDictBodyParam)
                .then(() => {
                    const addedBodyParam: DictBodyParam = {
                        id: Math.floor(Math.random() * 1000000), // Simulate ID generation, should be replaced by a real ID from backend
                        name: values.newDictBodyParamName,
                        description: values.newDictBodyParamDescription
                    };
                    onAddBodyParam(addedBodyParam);
                })
                .catch(error => {
                    console.error('Error adding body parameter:', error);
                });
        } else {
            console.log("Name already exists:", values.newDictBodyParamName);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictBodyParamName: '',
                    newDictBodyParamDescription: ''
                }}
                validationSchema={Yup.object({
                    newDictBodyParamName: Yup.string()
                        .required(t("validation.this_field_is_required")),
                    newDictBodyParamDescription: Yup.string()
                        .required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictBodyParam(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div className="form-container">
                            <div className="form-field-container">
                                <label htmlFor="language">
                                    <select
                                        id="language"
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="select-field"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="form-field-container">
                                <ErrorMessage name="newDictBodyParamName" component="div" className="error" />
                                <Field name="newDictBodyParamName" type="text" className="form-field" placeholder={t("table.name")} />
                            </div>

                            <div className="form-field-container">
                                <ErrorMessage name="newDictBodyParamDescription" component="div" className="error" />
                                <Field name="newDictBodyParamDescription" type="text" className="form-field" placeholder={t("table.description")} />
                            </div>

                            <button type="submit" disabled={formik.isSubmitting}>{t("buttons.add")}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictBodyParam);
