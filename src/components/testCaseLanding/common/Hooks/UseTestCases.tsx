import { useCallback, useState, useEffect, useRef } from "react";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { TestCase } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import * as _ from "lodash";
import { SortingState } from "@tanstack/react-table";

export const customSort = (a: string, b: string) => {
  if (a === undefined || a === "") {
    return 1;
  } else if (b === undefined || b === "") {
    return -1;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  const aComp = a.trim().toLocaleLowerCase();
  const bComp = b.trim().toLocaleLowerCase();
  if (aComp < bComp) return -1;
  if (aComp > bComp) return 1;
  return 0;
};

export const sortFilteredTestCases = (
  sorting: SortingState,
  testCases: TestCase[]
) => {
  const sorts = sorting?.[0];
  const testCaseCopy = testCases.slice();
  if (sorts) {
    const { id, desc } = sorts;
    // sort the testCaseList in either descending or ascending order based on the sorts object
    testCaseCopy.sort((a, b) => {
      const aValue = a[id as keyof typeof a] as string;
      const bValue = b[id as keyof typeof b] as string;
      // Use customSort function for comparing values
      const comparison = customSort(aValue, bValue);
      // If desc is true, reverse the order
      return desc ? -comparison : comparison;
    });
  }
  return testCaseCopy;
};

function UseFetchTestCases({ measureId, setErrors }) {
  const { search } = useLocation();
  const values = queryString.parse(search);
  const testCaseService = useRef(useTestCaseServiceApi());
  const [testCases, setTestCases] = useState<TestCase[]>(null); // all test cases.. what about
  const [sortedTestCases, setSortedTestCases] = useState<TestCase[]>(null); //An extra copy to remember remember sort order..
  // TO Do: figure out if this should just be sorted against lastModified for better space complexity. Time complexity will suffer. Not sure either will matter.
  const [loadingState, setLoadingState] = useState<any>({
    loading: true,
    message: "",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  // preserve sort order for react table display

  // Save local storage variable for page, filter, search, clear when navigating to different measure
  const testCasePageOptions = JSON.parse(
    window.localStorage.getItem("testCasesPageOptions")
  );
  useEffect(() => {
    // given we're on the base page and no we're not intentionally using search query params, we want to load them from local state.
    if (testCasePageOptions) {
      if (
        !Object.keys(values).length &&
        Object.keys(testCasePageOptions).length
      ) {
        const { filter, limit, search, page } = testCasePageOptions;
        navigate(
          `?filter=${filter}&search=${search}&page=${page}&limit=${limit}`
        );
      }
    }
  }, [testCasePageOptions, values]);
  const [testCasePage, setTestCasePage] = useState({
    totalItems: null,
    visibleItems: null,
    offset: 0,
    page: 1,
    limit: 10 || "All",
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
  const curLimit =
    values.limit === "All" && testCases?.length > 0
      ? testCases?.length
      : Number(values.limit) || 10;
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
      // save for navigation along the same measureId
      localStorage.setItem(
        "testCasesPageOptions",
        JSON.stringify({
          page: curPage,
          limit: (values.limit === "All" && values.limit) || curLimit,
          filter,
          search: searchQuery,
        })
      );
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
      // with filter specify filter key, without filter, check status, group, title, description
      if (searchQuery) {
        let filteredTestCases = [...testCases];
        if (filter) {
          filteredTestCases = testCases.filter((tc) =>
            tc[filterMap[filter]]
              ?.toLowerCase()
              .includes(searchQuery?.toLocaleLowerCase())
          );
        } else if (!filter) {
          // check for matches in any of the filter categories
          filteredTestCases = testCases.filter((tc) =>
            Object.values(filterMap).some((key) =>
              tc[key]?.toLowerCase().includes(searchQuery?.toLowerCase())
            )
          );
        }
        const sortedTestCases = sortFilteredTestCases(
          sorting,
          filteredTestCases
        );
        const currentSlice = [...sortedTestCases].slice(start, end);
        const count = Math.ceil(filteredTestCases.length / curLimit);
        const canGoNext = (() => {
          return curPage < count;
        })();
        setTestCasePage({
          totalItems: filteredTestCases.length,
          visibleItems: currentSlice.length,
          offset: start,
          page: curPage,
          limit: (values.limit === "All" && values.limit) || curLimit,
          count: Math.ceil(filteredTestCases.length / curLimit),
          currentSlice,
          handlePageChange,
          handleLimitChange,
          canGoNext,
          canGoPrev,
        });
      } else {
        const sortedTestCases = sortFilteredTestCases(sorting, testCases);
        const currentSlice = [...sortedTestCases].slice(start, end);
        const count = Math.ceil(testCases.length / curLimit);
        const canGoNext = (() => {
          return curPage < count;
        })();
        setTestCasePage({
          totalItems: testCases.length,
          visibleItems: currentSlice.length,
          offset: start,
          page: curPage,
          limit: (values.limit === "All" && values.limit) || curLimit,
          count,
          currentSlice,
          handlePageChange,
          handleLimitChange,
          canGoNext,
          canGoPrev,
        });
      }
    }
  }, [sortedTestCases, curPage, curLimit, filter, searchQuery, sorting]);
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
        setTestCases(testCaseList); // point of truth centralized state
        setSortedTestCases(
          testCaseList.sort((a, b) => b.caseNumber - a.caseNumber)
        ); // our actual sort
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
    testCases: sortedTestCases, //all test cases to run execution against
    testCasePage, //all pagination required values
    setTestCases,
    loadingState,
    setLoadingState,
    retrieveTestCases,
    sorting,
    setSorting,
  };
}

export default UseFetchTestCases;
