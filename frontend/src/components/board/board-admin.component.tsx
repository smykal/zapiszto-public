import React, { Component } from "react";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import AuthService from "../../services/auth.service";
import EventBus from "../../common/EventBus";
import CardsView from "../cards/view/CardsView";

type Props = {};

type State = {
  content: string;
  selectedTabIndex: number;
}

export default class BoardAdmin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
      selectedTabIndex: 0
    };
  }

  componentDidMount() {
    // zamiast wywoływać nieistniejące API, pobierz lokalnie użytkownika (jeśli potrzebne)
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({ content: `Logged as ${user.username}` });
    } else {
      this.setState({ content: "No admin info (not logged in)" });
    }

    EventBus.on("logout", () => {
      this.setState({
        content: "No admin info (not logged in)"
      });
    });
  }

  handleTabSelect = (index: number) => {
    this.setState({ selectedTabIndex: index });
  }

  render() {
    const { selectedTabIndex } = this.state;

    return (
      <div className="card-container">
        <Tabs
          selectedIndex={selectedTabIndex}
          onSelect={this.handleTabSelect}
          className={"center"}
          style={{ display: 'block' }}
        >
          <TabList>
            <Tab>Diagrams</Tab>
            <Tab>Approve Cards</Tab>
          </TabList>

          <TabPanel>
            <div className='card-container'>
              <img src="/images/zapiszto.png" alt="general diagram" style={{ width: "100%" }} />
            </div>
            <div className='card-container'>
              <img src="/images/zapiszto - public.png" alt="database diagram" style={{ width: "100%" }} />
            </div>
          </TabPanel>

          <TabPanel>
            <div style={{ marginTop: 8 }}>
              <CardsView />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
