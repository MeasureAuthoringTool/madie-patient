import { useContext } from "react";
import QdmExecutionContext, {
  QdmExecutionContextHolder,
} from "./QdmExecutionContext";

const useExecutionContext = (): QdmExecutionContextHolder =>
  useContext(QdmExecutionContext);

export default useExecutionContext;
