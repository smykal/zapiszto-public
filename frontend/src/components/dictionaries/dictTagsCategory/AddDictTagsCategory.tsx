import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { usePostDictTagsCategory } from '../../../services/dict/DictTagsCategoryTanstackService';
import { NewDictTagsCategory } from '../../../types/types';
import { withTranslation } from 'react-i18next';

type Props = {
    dictTagsCategory: any[];
    onAddCategory: (newCategory: any) => void;
    t: any;
};

const AddDictTagsCategory: React.FC<Props> = ({ dictTagsCategory, onAddCategory, t }) => {
    const [selectedLanguage] = useState("en");
    const postDictTagsCategoryMutation = usePostDictTagsCategory();

    const postDictTagsCategory = (values: { newDictTagsCategoryName: string, newDictTagsCategoryDescription: string }) => {
        const newDictTagsCategory: NewDictTagsCategory = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.newDictTagsCategoryName }
        };

        postDictTagsCategoryMutation.mutate(newDictTagsCategory, {
            onSuccess: () => {
                onAddCategory({
                    id: crypto.randomUUID(),
                    name: values.newDictTagsCategoryName,
                });
            },
            onError: (error) => {
                console.error('Error adding category:', error);
            }
        });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictTagsCategoryName: '',
                    newDictTagsCategoryDescription: ''
                }}
                validationSchema={Yup.object({
                    newDictTagsCategoryName: Yup.string()
                        .required(t("validation.this_field_is_required"))
                        .notOneOf(dictTagsCategory.map(item => item.name), 'Name already exists')
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictTagsCategory(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div className="form-container">
                            <div className="form-field-container">
                                <div style={{ height: "25px" }} />
                                <Field name="newDictTagsCategoryName" type="text" className="form-field" placeholder={t("table.name")} />
                                <ErrorMessage name="newDictTagsCategoryName" component="div" className="error" />
                            </div>
                            <button type="submit" disabled={formik.isSubmitting}>
                                {t("buttons.add")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictTagsCategory);