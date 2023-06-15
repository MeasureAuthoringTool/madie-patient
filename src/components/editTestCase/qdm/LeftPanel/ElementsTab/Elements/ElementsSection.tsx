import React, { useEffect, useState, useCallback, useRef } from "react";
import ElementSection from "../ElementSection";
import DynamicElementTabs from "./DynamicElementTabs";
import "./ElementsSection.scss";
import useCqmConversionService from "../../../../../../api/CqmModelConversionService";
import { uniq } from "lodash";
import { measureStore } from "@madie/madie-util";
import { DataElement } from "cqm-models";

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
  const [activeTab, setActiveTab] = useState("");
  // we retain state up here so we can use it to generate the other components.
  return (
    <ElementSection
      title="Elements"
      children={
        <div id="elements-section">
          {categories.length > 0 && (
            <DynamicElementTabs
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              dataElements={dataElements}
            />
          )}
        </div>
      }
    />
  );
};
export default ElementsSection;
