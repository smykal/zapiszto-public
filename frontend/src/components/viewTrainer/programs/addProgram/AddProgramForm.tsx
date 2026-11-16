import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ProgramsService from '../../../../services/programs/';
import { NewProgram, Program } from '../../../../types/types';
import Spinner from '../../../../common/Spinner';

interface AddProgramFormProps {
  onProgramAdded: (newProgram: Program) => void;
  existingPrograms: Program[];
}

const AddProgramForm: React.FC<AddProgramFormProps> = ({ onProgramAdded, existingPrograms }) => {
  const { t } = useTranslation('global');

  const handleAddProgram = async (values: NewProgram, { setSubmitting, resetForm }: any) => {
    try {
      const newProgramWithId: Program = {
        ...values,
        id: crypto.randomUUID(),
        createdBy: 0, // Ustawienie odpowiedniego createdBy
        createDate: new Date().toISOString(),
        clientName: 'Unknown' // Ustawienie domyślnej wartości dla clientName, jeśli nie ma innej wartości
      };

      await ProgramsService.postNewProgram(newProgramWithId);
      resetForm();
      onProgramAdded(newProgramWithId);  // Przekaż nowo dodany program jako argument
    } catch (error) {
      console.error('Error adding program:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    programName: Yup.string()
      .max(30, t('validation.program_name_too_long'))
      .test('unique-programName', t('programs.program_name_exists'), value => {
        return !existingPrograms.some(program => program.programName === value);
      })
      .required(t('validation.this_field_is_required')),
  });

  return (
    <div>
      <Formik
        initialValues={{ id: '', programName: '', createdBy: 0 }}
        validationSchema={validationSchema}
        onSubmit={handleAddProgram}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field 
              type="text" 
              name="programName" 
              placeholder={t('programs.program_name_placeholder')} 
              className="field" />
              <ErrorMessage name="programName" component="div"/>
            </div>
            <button type="submit" disabled={isSubmitting} className='field'>
              {t('buttons.add')}
            </button>
            {isSubmitting && <Spinner />}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProgramForm;
