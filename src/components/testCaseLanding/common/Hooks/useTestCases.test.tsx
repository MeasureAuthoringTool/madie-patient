import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import UseFetchTestCases from "./UseTestCases";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { renderHook } from "@testing-library/react-hooks";
import { measureStore } from "@madie/madie-util";

const mockNavigate = jest.fn();

jest.mock("../../../../api/useTestCaseServiceApi");
jest.mock("@madie/madie-util", () => ({
  measureStore: {
    updateTestCases: jest.fn(),
  },
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: "" }),
}));

const MockComponent = ({ measureId, setErrors }) => {
  const { testCases, loadingState } = UseFetchTestCases({
    measureId,
    setErrors,
  });

  if (loadingState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {testCases ? (
        testCases.map((testCase, index) => (
          <div key={index}>{testCase.title}</div>
        ))
      ) : (
        <div>No Test Cases Found</div>
      )}
    </div>
  );
};

describe("UseFetchTestCases", () => {
  const mockSetErrors = jest.fn();
  const mockGetTestCasesByMeasureId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTestCaseServiceApi.mockReturnValue({
      getTestCasesByMeasureId: mockGetTestCasesByMeasureId,
    });
  });
  it("should retrieve test cases on mount", async () => {
    const testCaseList = [
      { title: "Test Case 1", validResource: true, lastModifiedAt: new Date() },
      {
        title: "Test Case 2",
        validResource: false,
        lastModifiedAt: new Date(),
      },
    ];

    mockGetTestCasesByMeasureId.mockResolvedValue(testCaseList);

    render(
      <MemoryRouter>
        <MockComponent measureId="123" setErrors={mockSetErrors} />
      </MemoryRouter>
    );

    expect(mockGetTestCasesByMeasureId).toHaveBeenCalledWith("123");

    // Wait for the loading state to finish
    expect(await screen.findByText("Test Case 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Case 2")).toBeInTheDocument();
  });

  it("should handle errors when retrieving test cases", async () => {
    const errorMessage = "Failed to fetch test cases";
    mockGetTestCasesByMeasureId.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <MockComponent measureId="123" setErrors={mockSetErrors} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No Test Cases Found")).toBeInTheDocument();
    });
  });

  it("should navigate to the correct URL when page or limit changes", () => {
    const { result } = renderHook(() =>
      UseFetchTestCases({ measureId: "123", setErrors: mockSetErrors })
    );

    result.current.testCasePage.handlePageChange(null, 2);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("page=2")
    );

    result.current.testCasePage.handleLimitChange({ target: { value: 20 } });
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("limit=20")
    );
  });

  it("should save pagination options to local storage", () => {
    const { result } = renderHook(() =>
      UseFetchTestCases({ measureId: "123", setErrors: mockSetErrors })
    );
    result.current.setTestCases([
      { title: "Test Case 1" },
      { title: "Test Case 2" },
    ]);

    expect(window.localStorage.getItem("testCasesPageOptions")).toContain(
      "page"
    );
    expect(window.localStorage.getItem("testCasesPageOptions")).toContain(
      "limit"
    );
  });
});
