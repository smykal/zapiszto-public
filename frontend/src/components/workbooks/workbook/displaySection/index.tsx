import React, { Component } from 'react';
import { Workbook } from '../../../../types/types';
import PostTraining from './postTraining';
import ShowTrainings from './showTrainings';
import CopyTraining from './CopyTraining';

type Props = {
  workbook: Workbook
}

type State = {
  refreshKey: number;
};

class DisplaySection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      refreshKey: 0, // Klucz do wymuszania odświeżenia
    };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh() {
    // Aktualizujemy klucz odświeżania
    this.setState((prevState) => ({
      refreshKey: prevState.refreshKey + 1,
    }));
  }

  render() {
    const { workbook } = this.props;
    const { refreshKey } = this.state;

    return (
      <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <PostTraining workbook_id={workbook.id} onRefresh={this.handleRefresh} />
          <CopyTraining workbook_id={workbook.id} onRefresh={this.handleRefresh} />
        </div>
        <ShowTrainings workbook_id={workbook.id} key={refreshKey} />
      </div>
    );
  }
}

export default DisplaySection;
