import React, { useEffect, useState, useCallback, useRef } from "react";
import { uniq } from "lodash";
import { DataElement } from "cqm-models";

import ElementSection from "../ElementSection";
import DynamicElementTabs from "./DynamicElementTabs";
import useCqmConversionService from "../../../../../../api/CqmModelConversionService";
import { measureStore } from "@madie/madie-util";
import DataElementsList from "./DataElementsList";
import DataElementsCard from "./DataElementsCard/DataElementsCard";
import "./ElementsSection.scss";
import "./DataElementsList.scss";

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

  // This looks to be implemented to avoid demographics clashing
  const findDataElements = (category: string): DataElement[] => {
    const elements: DataElement[] = dataElements?.filter(
      (element) =>
        element.qdmCategory === category &&
        element.qdmStatus !== "ethnicity" &&
        element.qdmStatus !== "race" &&
        element.qdmStatus !== "gender"
    );
    return elements;
  };
  const [activeTab, setActiveTab] = useState(""); // OnChange we need to remove our focused element
  const [cardActiveTab, setCardActiveTab] = useState("codes"); // sub tabs in card

  const [availableDataElements, setAvailableDataElements] =
    useState<DataElement[]>();
  const [selectedDataElement, setSelectedDataElement] = useState<DataElement>();

  useEffect(() => {
    if (activeTab) {
      setAvailableDataElements(findDataElements(activeTab));
    }
  }, [activeTab]);
  // whenever we update the active tab, we want to blank the selectedDataElement
  const handleActiveTab = (v) => {
    setSelectedDataElement(null);
    setActiveTab(v);
  };
  // we retain state up here so we can use it to generate the other components.
  return (
    <ElementSection
      title="Elements"
      children={
        <div id="elements-section" data-testId="elements-section">
          {categories.length > 0 && (
            <DynamicElementTabs
              categories={categories}
              activeTab={activeTab}
              setActiveTab={handleActiveTab}
            />
          )}
          {/* display big card if selected. Selection happens onClick in avaialable El tab*/}
          <div className="tabs-container">
            {selectedDataElement && (
              <DataElementsCard
                selectedDataElement={selectedDataElement}
                setSelectedDataElement={setSelectedDataElement}
                cardActiveTab={cardActiveTab}
                setCardActiveTab={setCardActiveTab}
              />
            )}
          </div>
          {/* data elements list */}
          {availableDataElements && !selectedDataElement && (
            <div className="data-types">
              {/* @ts-ignore-line */}
              <DataElementsList
                availableDataElements={availableDataElements}
                setSelectedDataElement={setSelectedDataElement}
              />
            </div>
          )}
        </div>
      }
    />
  );
};
export default ElementsSection;
