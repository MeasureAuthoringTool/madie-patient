import { useCallback, useState, useEffect, useRef } from "react";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { TestCase } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import * as _ from "lodash";

function UseFetchTestCases({ measureId, setErrors }) {
  const { search } = useLocation();
  const values = queryString.parse(search);
  const testCaseService = useRef(useTestCaseServiceApi());
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [loadingState, setLoadingState] = useState<any>({
    loading: true,
    message: "",
  });

  // make a nice package for stuff to use
  const [testCasePage, setTestCasePage] = useState({
    totalItems: null,
    visibleItems: null,
    offset: 0,
    page: 1,
    limit: 10,
    count: undefined,
    currentSlice: [],
    canGoNext: false,
    canGoPrev: false,
    handlePageChange: (e, v) => {
      navigate(
        `?filter=${values.filter ? values.filter : ""}&search=${
          values.search ? values.search : ""
        }&page=${v}&limit=${values.limit ? values.limit : 10}`
      );
    },
    handleLimitChange: (e) => {
      navigate(
        `?filter=${values.filter ? values.filter : ""}&search=${
          values.search ? values.search : ""
        }&page=${1}&limit=${e.target.value}`
      );
    },
  });
  const { updateTestCases } = measureStore;
  const filter: string = values?.filter ? values.filter.toString() : "";
  // pull info from some query url
  let searchQuery: string = values?.search ? values.search.toString() : "";
  const curLimit = (values.limit && Number(values.limit)) || 10;
  const curPage = (values.page && Number(values.page)) || 1;
  let navigate = useNavigate();

  const getTestCasePage = useCallback(() => {
    // first we want to get all the possible test cases based off of our filter
    if (testCases) {
      const filterMap = {
        Group: "series",
        Status: "executionStatus",
        Title: "title",
        Description: "description",
      };
      // edge case that will certainly get hit
      if (
        filterMap[filter] === "executionStatus" &&
        searchQuery.toLowerCase() === "n/a"
      ) {
        searchQuery = "NA";
      }
      const start = (curPage - 1) * curLimit;
      const end = start + curLimit;

      const canGoPrev = Number(values?.page) > 1;

      const handlePageChange = (e, v) => {
        navigate(
          `?filter=${values.filter ? values.filter : ""}&search=${
            values.search ? values.search : ""
          }&page=${v}&limit=${values.limit ? values.limit : 10}`
        );
      };
      const handleLimitChange = (e) => {
        navigate(
          `?filter=${values.filter ? values.filter : ""}&search=${
            values.search ? values.search : ""
          }&page=${1}&limit=${e.target.value}`
        );
      };
      if (searchQuery) {
        const filteredTestCases = testCases.filter((tc) =>
          tc[filterMap[filter]]
            ?.toLowerCase()
            .includes(searchQuery?.toLocaleLowerCase())
        );
        const currentSlice = [...filteredTestCases].slice(start, end);
        const count = Math.ceil(filteredTestCases.length / curLimit);
        const canGoNext = (() => {
          return curPage < count;
        })();
        setTestCasePage({
          totalItems: filteredTestCases.length,
          visibleItems: currentSlice.length,
          offset: start,
          page: curPage,
          limit: curLimit,
          count: Math.ceil(filteredTestCases.length / curLimit),
          currentSlice,
          handlePageChange,
          handleLimitChange,
          canGoNext,
          canGoPrev,
        });
      } else {
        const currentSlice = [...testCases].slice(start, end);
        const count = Math.ceil(testCases.length / curLimit);
        const canGoNext = (() => {
          return curPage < count;
        })();
        setTestCasePage({
          totalItems: testCases.length,
          visibleItems: currentSlice.length,
          offset: start,
          page: curPage,
          limit: curLimit,
          count,
          currentSlice,
          handlePageChange,
          handleLimitChange,
          canGoNext,
          canGoPrev,
        });
      }
    }
  }, [testCases, curPage, curLimit, filter, searchQuery]);
  useEffect(() => {
    getTestCasePage();
  }, [getTestCasePage]);
  // this will only ever get the total test cases
  const retrieveTestCases = useCallback(() => {
    setLoadingState(() => ({
      loading: true,
      message: "Loading Test Cases...",
    }));
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        testCaseList.forEach((testCase: any) => {
          testCase.executionStatus = testCase.validResource ? "NA" : "Invalid";
        });
        testCaseList = _.orderBy(testCaseList, ["lastModifiedAt"], ["desc"]);
        updateTestCases(testCaseList);
        setTestCases(testCaseList);
      })
      .catch((err) => {
        setErrors((prevState) => [...prevState, err.message]);
      })
      .finally(() => {
        setLoadingState({ loading: false, message: "" });
      });
  }, [measureId, testCaseService, setErrors]);

  useEffect(() => {
    retrieveTestCases();
  }, [retrieveTestCases]);
  return {
    testCaseService,
    testCases, //all test cases to run execution against
    testCasePage, //all pagination required values
    setTestCases,
    loadingState,
    setLoadingState,
    retrieveTestCases,
  };
}

export default UseFetchTestCases;
