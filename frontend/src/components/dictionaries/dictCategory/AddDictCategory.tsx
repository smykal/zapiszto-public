import React, { useState } from "react";
import { DictCategories, NewDictCategory } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Service from '../../../services/dict/DictCategoryService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictCategory: DictCategories[];
    onAddCategory: (newCategory: DictCategories) => void;
    t: any;
};

const AddDictCategory: React.FC<Props> = ({ dictCategory, onAddCategory, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const postDictCategory = (values: { newDictCategoryName: string, newDictCategoryDescription: string }) => {
        const newDictCategory: NewDictCategory = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.newDictCategoryName },
            description: { [selectedLanguage]: values.newDictCategoryDescription }
        };
        Service.postDictCategory(newDictCategory)
            .then(response => {
                const addedCategory: DictCategories = {
                    id: crypto.randomUUID(),
                    dict: "PER_USER",
                    dict_id: newDictCategory.id,
                    name: values.newDictCategoryName,
                    description: values.newDictCategoryDescription
                };
                onAddCategory(addedCategory);
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictCategoryName: '',
                    newDictCategoryDescription: ''
                }}
                validationSchema={Yup.object({
                    newDictCategoryName: Yup.string()
                        .required(t("validation.this_field_is_required"))
                        .notOneOf(dictCategory.map(item => item.name), 'Nazwa już istnieje'),
                    newDictCategoryDescription: Yup.string()
                        .required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictCategory(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div>
                            <div>
                                <div />
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
                                <div>
                                    <ErrorMessage name="newDictCategoryName" component="div" className="error" />
                                </div>
                                <Field name="newDictCategoryName" type="text" className="field" placeholder={t("table.name")} />
                            </div>
                            <div>
                                <div>
                                    <ErrorMessage name="newDictCategoryDescription" component="div" className="error" />
                                </div>
                                <Field name="newDictCategoryDescription" type="text" className="field" placeholder={t("table.description")} />
                            </div>
                            <span>
                                <button type="submit" disabled={formik.isSubmitting} className="field">
                                    {t("buttons.add")}
                                </button>
                            </span>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default withTranslation("global")(AddDictCategory);
