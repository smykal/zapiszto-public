import React, { useState } from "react";
import { DictBodyTest, NewDictBodyTest } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DictBodyTestService from '../../../services/dict/DictBodyTestService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictBodyTests: DictBodyTest[];
    onAddBodyTest: (newBodyTest: DictBodyTest) => void;
    t: any;
};

const AddDictBodyTest: React.FC<Props> = ({ dictBodyTests, onAddBodyTest, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const postDictBodyTest = (values: { newDictBodyTestName: string, newDictBodyTestDescription: string, newDictBodyTestPurpose: string }) => {
        const isNameExisting = dictBodyTests.some(test => test.name === values.newDictBodyTestName);
        if (!isNameExisting) {
            const newDictBodyTest: NewDictBodyTest = {
                id: crypto.randomUUID(),
                name: { [selectedLanguage]: values.newDictBodyTestName },
                description: { [selectedLanguage]: values.newDictBodyTestDescription },
                purpose: { [selectedLanguage]: values.newDictBodyTestPurpose }
            };
            DictBodyTestService.postDictBodyTest(newDictBodyTest)
                .then(response => {
                    const addedBodyTest: DictBodyTest = {
                        id: crypto.randomUUID(),
                        dict: "PER_USER",
                        dict_id: newDictBodyTest.id,
                        name: values.newDictBodyTestName,
                        description: values.newDictBodyTestDescription,
                        purpose: values.newDictBodyTestPurpose
                    };
                    onAddBodyTest(addedBodyTest);
                })
                .catch(error => {
                    console.error('Error adding body test:', error);
                });
        } else {
            console.log("Name already exists:", values.newDictBodyTestName);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictBodyTestName: '',
                    newDictBodyTestDescription: '',
                    newDictBodyTestPurpose: ''
                }}
                validationSchema={Yup.object({
                    newDictBodyTestName: Yup.string()
                        .required(t("validation.this_field_is_required")),
                    newDictBodyTestDescription: Yup.string()
                        .required(t("validation.this_field_is_required")),
                    newDictBodyTestPurpose: Yup.string()
                        .required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictBodyTest(values);
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
                                <ErrorMessage name="newDictBodyTestName" component="div" className="error" />
                                <Field name="newDictBodyTestName" type="text" className="field" placeholder={t("table.name")} />
                            </div>

                            <div>
                                <ErrorMessage name="newDictBodyTestDescription" component="div" className="error" />
                                <Field name="newDictBodyTestDescription" type="text" className="field" placeholder={t("table.description")} />
                            </div>

                            <div>
                                <ErrorMessage name="newDictBodyTestPurpose" component="div" className="error" />
                                <Field name="newDictBodyTestPurpose" type="text" className="field" placeholder={t("table.purpose")} />
                            </div>

                            <button type="submit" disabled={formik.isSubmitting} className="field">{t("buttons.add")}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictBodyTest);
