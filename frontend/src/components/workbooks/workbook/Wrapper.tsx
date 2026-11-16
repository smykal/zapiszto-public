import React, { Component } from 'react';
import { Workbook } from '../../../types/types';
import DisplaySection from './displaySection';

type Props = {
  workbook: Workbook;
};

class Wrapper extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { workbook } = this.props;
    return (
      <div>
        {workbook.dict_workbook_schema_name !== 'brak_schematu' && (
          <>
            <DisplaySection workbook={workbook} />
          </>
        )}
      </div>
    );
  }
}

export default (Wrapper)
