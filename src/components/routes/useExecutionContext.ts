import { useContext } from "react";
import ExecutionContext, { ExecutionContextHolder } from "./ExecutionContext";

const useExecutionContext = (): ExecutionContextHolder =>
  useContext(ExecutionContext);

export default useExecutionContext;
