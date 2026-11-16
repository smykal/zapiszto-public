import React, { Component } from "react";
import Collapsible from 'react-collapsible';
import ShowDiagram from "./bodyParam/showDiagramOne";
import ShowBmi from "./showBmi";
import ShowBmr from "./showBmr";
import ShowCpf from "./showCpf";
import GetGender from "./gender";
import Age from "./age";
import { BodyParamsItem, BmiItem } from '../../types/types';
import { withTranslation, WithTranslation } from "react-i18next";

type Props = WithTranslation & {
  bodyParams: BodyParamsItem[] | null;
  gender: string | null;
  age: number | null;
  bmi: BmiItem[] | null;
  updateData: () => void;
};

type State = {
  expandedItemIndex: number | null;
  bmiExpanded: boolean;
  genderExpanded: boolean;
  ageExpanded: boolean;
  bmrExpanded: boolean;
  cpfExpanded: boolean;
  bodyPhotosExpanded: boolean;
};

class ShowBodyParams extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedItemIndex: null,
      bmiExpanded: false,
      genderExpanded: false,
      ageExpanded: false,
      bmrExpanded: false,
      cpfExpanded: false,
      bodyPhotosExpanded: false,
    };
  }

  handleItemClick(index: number) {
    this.setState((prevState) => ({
      expandedItemIndex: prevState.expandedItemIndex === index ? null : index,
    }));
  }

  handleBmiClick = () => this.setState((prevState) => ({ bmiExpanded: !prevState.bmiExpanded }));
  handleGenderClick = () => this.setState((prevState) => ({ genderExpanded: !prevState.genderExpanded }));
  handleAgeClick = () => this.setState((prevState) => ({ ageExpanded: !prevState.ageExpanded }));
  handleBmrClick = () => this.setState((prevState) => ({ bmrExpanded: !prevState.bmrExpanded }));
  handleCpfClick = () => this.setState((prevState) => ({ cpfExpanded: !prevState.cpfExpanded }));
  handleBodyPhotosClick = () => this.setState((prevState) => ({ bodyPhotosExpanded: !prevState.bodyPhotosExpanded }));

  getUniqueBodyParams = () => {
    if (!Array.isArray(this.props.bodyParams)) {
      console.error("bodyParams is not an array:", this.props.bodyParams);
      return [];
    }
    const uniqueParams: { [key: string]: BodyParamsItem } = {};
    this.props.bodyParams.forEach((item) => {
      uniqueParams[item.value] = item;
    });
    return Object.values(uniqueParams);
  };

  render() {
    const { bmrExpanded, bmiExpanded, genderExpanded, ageExpanded, cpfExpanded } = this.state;
    const { t, gender, age, updateData } = this.props;
    const uniqueBodyParams = this.getUniqueBodyParams();

    return (
      <div>
        <ul>
          <li>
            <Collapsible
              trigger={
                <div className="collapsible-element" onClick={this.handleGenderClick}>
                  <span>{t("body_params.gender")}: {gender || t("body_params.gender_not_set")}</span>
                </div>
              }
              open={genderExpanded}
            >
              <GetGender updateData={updateData} />
            </Collapsible>
          </li>
          <li>
            <Collapsible
              trigger={
                <div className="collapsible-element" onClick={this.handleAgeClick}>
                  <span>{t("body_params.age")}: {age !== null ? age : t("body_params.age_not_set")}</span>
                </div>
              }
              open={ageExpanded}
            >
              <Age updateData={updateData}/>
            </Collapsible>
          </li>
          <li>
            <Collapsible
              trigger={
                <div className="collapsible-element" onClick={this.handleBmiClick}>
                  <span>{t("body_params.body_mass_index")}</span>
                </div>
              }
              open={bmiExpanded}
            >
              {this.props.bmi ? <ShowBmi bmiList={this.props.bmi} /> : <p>{t("errors.bmi_not_found")}</p>}
            </Collapsible>
          </li>
          <li>
            <Collapsible
              trigger={
                <div className="collapsible-element" onClick={this.handleBmrClick}>
                  <span>{t("body_params.basal_metabolic_rate")}</span>
                </div>
              }
              open={bmrExpanded}
            >
              <ShowBmr />
            </Collapsible>
          </li>
          <li>
            <Collapsible
              trigger={
                <div className="collapsible-element" onClick={this.handleCpfClick}>
                  <span>{t("body_params.carbs_fat_protein")}</span>
                </div>
              }
              open={cpfExpanded}
            >
              <ShowCpf />
            </Collapsible>
          </li>
          {uniqueBodyParams.length > 0 &&
            uniqueBodyParams.map((item, index) => (
              <li key={index}>
                <Collapsible
                  trigger={
                    <div className="collapsible-element" onClick={() => this.handleItemClick(index)}>
                      <span>{item.dict_body_params_name}: {item.value}</span>
                    </div>
                  }
                >
                  <ShowDiagram param_name={item.dict_body_params_name} />
                </Collapsible>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default withTranslation("global")(ShowBodyParams);
