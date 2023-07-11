import { useContext } from "react";
import QdmExecutionContext, {
  QdmExecutionContextHolder,
} from "./QdmExecutionContext";

const useQdmExecutionContext = (): QdmExecutionContextHolder =>
  useContext(QdmExecutionContext);

export default useQdmExecutionContext;
