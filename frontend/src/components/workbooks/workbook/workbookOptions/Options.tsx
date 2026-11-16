import React from 'react';
import { Workbook } from '../../../../types/types';
import { useDeleteWorkbook } from '../../../../services/workbooks/WorkbooksTanstackService';
import { withTranslation } from 'react-i18next';

type Props = {
  workbook: Workbook;
  t: any;
};

const Options: React.FC<Props> = ({ workbook, t }) => {
  const deleteWorkbook = useDeleteWorkbook();

  const handleDeleteClick = async () => {
    const confirmMessage = `${t('buttons.delete')} "${workbook.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteWorkbook.mutateAsync(workbook.id.valueOf());
        console.log('Workbook deleted successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting workbook:', error);
      }
    }
  };

  return (
    <div>
      <button className='buttonDelete' onClick={handleDeleteClick}>
        {t("buttons.delete")} {workbook.name}
      </button>
    </div>
  );
};

export default withTranslation("global")(Options);