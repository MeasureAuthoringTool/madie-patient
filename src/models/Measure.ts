import { Model } from "./Model";
import { MeasureScoring } from "./MeasureScoring";
import { PopulationType } from "./MeasurePopulation";

export interface MeasureMetadata {
  steward?: string;
  description?: string;
  copyright?: string;
}

export interface Group {
  id: string;
  scoring?: string;
  population?: PopulationType;
}

export default interface Measure {
  id: string;
  measureHumanReadableId: string;
  measureSetId: string;
  version: number;
  revisionNumber: number;
  state: string;
  measureName: string;
  cqlLibraryName: string;
  measureScoring: MeasureScoring | "";
  cql: string;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  model: Model | "";
  measureMetaData?: MeasureMetadata;
  groups?: Array<Group>;
  elmJson?: string;
}
