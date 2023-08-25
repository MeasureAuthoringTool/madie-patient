import React, { useEffect, useState, useCallback, useRef } from "react";
import { uniq } from "lodash";
import { DataElement } from "cqm-models";

import ElementSection from "../../../../../../util/ElementSection";
import DynamicElementTabs from "./DynamicElementTabs";
import useCqmConversionService from "../../../../../../api/CqmModelConversionService";
import { measureStore } from "@madie/madie-util";
import DataElementsList from "./DataElementsList";
import DataElementsCard from "./DataElementsCard/DataElementsCard";
import "./ElementsSection.scss";
import "./DataElementsList.scss";
import {
  PatientActionType,
  useQdmPatient,
} from "../../../../../../util/QdmPatientContext";
import DataElementsTable from "./DataElementsTable";
import {
  filterDataElements,
  getDataElementClass,
} from "../../../../../../util/DataElementHelper";

const ElementsSection = () => {
  const cqmService = useRef(useCqmConversionService());
  const [measure, setMeasure] = useState<any>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [categories, setCategories] = useState([]);
  const [dataElements, setDataElements] = useState<DataElement[]>([]);
  const { state, dispatch } = useQdmPatient();
  const { patient } = state;

  const retrieveCategories = useCallback(() => {
    cqmService.current.fetchSourceDataCriteria(measure.cql).then((r) => {
      const categories = r.map((r) => r.qdmCategory).sort();
      setCategories(uniq(categories));
      setDataElements(r);
    });
  }, [measure?.cql, cqmService.current, setCategories, cqmService?.current]);

  useEffect(() => {
    if (measure?.cql) {
      retrieveCategories();
    }
  }, [measure?.cql]);

  const [activeTab, setActiveTab] = useState(""); // OnChange we need to remove our focused element
  const [cardActiveTab, setCardActiveTab] = useState("codes"); // sub tabs in card

  const [availableDataElements, setAvailableDataElements] =
    useState<DataElement[]>();
  const [selectedDataElement, setSelectedDataElement] = useState<DataElement>();

  useEffect(() => {
    if (activeTab) {
      setAvailableDataElements(filterDataElements(dataElements, activeTab));
    }
  }, [activeTab]);
  // whenever we update the active tab, we want to blank the selectedDataElement
  const handleActiveTab = (v) => {
    setSelectedDataElement(null);
    setActiveTab(v);
  };

  const handleAddDataElement = (dataElement) => {
    const modelClass = getDataElementClass(dataElement);
    const newDataElement = new modelClass(dataElement);
    setSelectedDataElement(newDataElement);
    dispatch({
      type: PatientActionType.ADD_DATA_ELEMENT,
      payload: newDataElement,
    });
  };

  // we retain state up here so we can use it to generate the other components.
  return (
    <ElementSection title="Elements">
      <div id="elements-section" data-testid="elements-section">
        {categories.length > 0 && (
          <DynamicElementTabs
            categories={categories}
            activeTab={activeTab}
            setActiveTab={handleActiveTab}
          />
        )}
        {/* display big card if selected. Selection happens onClick in avaialable El tab*/}
        <div
          className="tabs-container"
          data-testid="data-elementscard-container"
        >
          {selectedDataElement && (
            <DataElementsCard
              selectedDataElement={selectedDataElement}
              setSelectedDataElement={setSelectedDataElement}
              cardActiveTab={cardActiveTab}
              setCardActiveTab={setCardActiveTab}
              onChange={(changedDataElement) => {
                dispatch({
                  type: PatientActionType.MODIFY_DATA_ELEMENT,
                  payload: changedDataElement,
                });
              }}
            />
          )}
        </div>
        {/* data elements list */}
        {availableDataElements && !selectedDataElement && (
          <div className="data-types" data-testid="data-elementslist-container">
            {/* @ts-ignore-line */}
            <DataElementsList
              availableDataElements={availableDataElements}
              setSelectedDataElement={handleAddDataElement}
            />
          </div>
        )}
        <DataElementsTable
          dataElements={filterDataElements(patient?.dataElements)}
          onView={(dataElement) => setSelectedDataElement(dataElement)}
        />
      </div>
    </ElementSection>
  );
};
export default ElementsSection;
