import React, { useEffect, useState, useCallback, useRef } from "react";
import { uniq } from "lodash";
import { DataElement } from "cqm-models";
import { ObjectID } from "bson";

import ElementSection from "../../../../../common/ElementSection";
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
import DataElementsTable from "./DataElementsTable/DataElementsTable";
import {
  filterDataElements,
  getDataElementClass,
} from "../../../../../../util/DataElementHelper";

const ElementsSection = (props: {
  handleTestCaseErrors: Function;
  canEdit: boolean;
}) => {
  const { handleTestCaseErrors, canEdit } = props;
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
  // init an object that will track which data element types are allowed based on our cql / source-data-criteria
  const [allowedTypes, setAllowedTypes] = useState({});
  const { state, dispatch } = useQdmPatient();
  const { patient } = state;

  const checkForMissingDataElements = useCallback(() => {
    const types = {};
    dataElements.forEach((item) => {
      types[item._type] = true;
    });
    setAllowedTypes(types);
    let failedLookupCount = 0;
    patient?.dataElements.forEach((el) => {
      if (
        !types[el._type] &&
        el._type !== "QDM::PatientCharacteristicBirthdate"
      ) {
        failedLookupCount++;
      }
    });
    if (failedLookupCount) {
      handleTestCaseErrors(
        "There are data elements in this test case not relevant to the measure.  Those data elements are not editable and can only be deleted from the Elements table."
      );
    }
  }, [
    setAllowedTypes,
    handleTestCaseErrors,
    dataElements?.length,
    patient?.dataElements?.length,
  ]);

  useEffect(() => {
    if (dataElements?.length > 0 && patient?.dataElements?.length > 0) {
      checkForMissingDataElements();
    }
  }, [dataElements, patient?.dataElements]);

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
  }, [measure?.cql, retrieveCategories]);

  const [activeTab, setActiveTab] = useState(""); // OnChange we need to remove our focused element
  const [cardActiveTab, setCardActiveTab] = useState("codes"); // sub tabs in card

  const [availableDataElements, setAvailableDataElements] =
    useState<DataElement[]>();
  const [selectedDataElement, setSelectedDataElement] = useState<DataElement>();

  useEffect(() => {
    if (activeTab) {
      setAvailableDataElements(filterDataElements(dataElements, activeTab));
    }
  }, [activeTab, dataElements]);
  // whenever we update the active tab, we want to blank the selectedDataElement
  const handleActiveTab = (v) => {
    setSelectedDataElement(null);
    setActiveTab(v);
  };

  const handleAddDataElement = (sourceCriteria) => {
    const data = { ...sourceCriteria, id: new ObjectID().toString() };
    const modelClass = getDataElementClass(sourceCriteria);
    const newDataElement = new modelClass(data);
    setSelectedDataElement(newDataElement);
    dispatch({
      type: PatientActionType.ADD_DATA_ELEMENT,
      payload: newDataElement,
    });
  };

  const deleteDataElement = (id: string) => {
    if (selectedDataElement?.id === id) {
      setSelectedDataElement(null);
    }
    dispatch({
      type: PatientActionType.REMOVE_DATA_ELEMENT,
      payload: { id: id },
    });
  };

  // we retain state up here so we can use it to generate the other components.
  return (
    <ElementSection title="Elements">
      <div id="elements-section" data-testid="elements-section">
        {categories.length > 0 && canEdit && (
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
              canEdit={canEdit}
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
          allowedTypes={allowedTypes}
          dataElements={filterDataElements(patient?.dataElements)}
          onView={(dataElement) => setSelectedDataElement(dataElement)}
          onDelete={deleteDataElement}
        />
      </div>
    </ElementSection>
  );
};
export default ElementsSection;
