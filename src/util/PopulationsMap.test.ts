import { triggerPopChanges } from "./PopulationsMap";
import {
  PopulationType,
  GroupPopulation,
  PopulationValue,
} from "@madie/madie-models";

it("return the input matches output with no changes", () => {
  const populationVal: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(populationVal);
  const group1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "Boolean",
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input matches output with no changes if targetId not found", () => {
  const populationVal: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(populationVal);
  const group1: GroupPopulation = {
    groupId: "initialPopulation",
    populationBasis: "Boolean",
    scoring: "Cohort",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [group1];

  const resultPops = triggerPopChanges(groupPopulations, "WRONG_ID", {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(resultPops[0].populationValues[0].name).toEqual("initialPopulation");
  expect(resultPops[0].populationValues[0].expected).toBeTruthy();
});

it("return the input with IPP changed to Expected because Denom is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);
  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Denom Exception is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected because Numer is Expected", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Numer is Unchecked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exception is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected when Denom Exclusion is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("return the input with IPP Expected, Denom Expected and Numer Expected when Numer Exclusion is checked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeTruthy();
});

it("when Denom is unchecked, then Numer, Denom Exclusion, Denom Exception, Numerator Exclusion should also be uncheked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: true,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Proportion"
    )
  ).toBeTruthy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCLUSION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR_EXCEPTION,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR_EXCLUSION,
      "Proportion"
    )
  ).toBeFalsy();
});

it("when IPP is unchecked then rest of populations expected values should also be unchecked", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: true,
    actual: false,
  };
  const denomExcep: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCEPTION,
    expected: false,
    actual: false,
  };
  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: false,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: true,
    actual: false,
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExcep);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Proportion",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.INITIAL_POPULATION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.NUMERATOR,
      "Proportion"
    )
  ).toBeFalsy();
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Proportion"
    )
  ).toBeFalsy();
});

it("", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const msrpopl: PopulationValue = {
    name: PopulationType.MEASURE_POPULATION,
    expected: false,
    actual: false,
  };
  const msrpoplex: PopulationValue = {
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: true,
    actual: false,
  };
  const measureObserv: PopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: true,
    actual: false,
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(msrpopl);
  populationValues.push(msrpoplex);
  populationValues.push(measureObserv);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Continuous Variable",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: true,
    actual: undefined,
  });

  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Continuous Variable"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Continuous Variable"
    )
  ).toEqual(false);

  const resultPops2 = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.MEASURE_POPULATION_EXCLUSION,
    expected: false,
    actual: undefined,
  });

  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Continuous Variable"
    )
  ).toEqual(false);
});

it("", () => {
  const ipp: PopulationValue = {
    name: PopulationType.INITIAL_POPULATION,
    expected: false,
    actual: false,
  };
  const denom: PopulationValue = {
    name: PopulationType.DENOMINATOR,
    expected: false,
    actual: false,
    id: "2",
    criteriaReference: "",
  };

  const denomExclu: PopulationValue = {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const numer: PopulationValue = {
    name: PopulationType.NUMERATOR,
    expected: false,
    actual: false,
    id: "1",
    criteriaReference: "",
  };
  const numerExclu: PopulationValue = {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: false,
  };
  const measureObserv1: PopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "3",
    criteriaReference: "1",
  };
  const measureObserv2: PopulationValue = {
    name: PopulationType.MEASURE_OBSERVATION,
    expected: false,
    actual: false,
    id: "4",
    criteriaReference: "2",
  };
  const populationValues: PopulationValue[] = [];
  populationValues.push(ipp);
  populationValues.push(denom);
  populationValues.push(denomExclu);
  populationValues.push(numer);
  populationValues.push(numerExclu);
  populationValues.push(measureObserv1);
  populationValues.push(measureObserv2);

  const group1: GroupPopulation = {
    groupId: "shrug",
    populationBasis: "Boolean",
    scoring: "Ratio",
    populationValues: populationValues,
  };
  const groupPopulations: GroupPopulation[] = [];
  groupPopulations.push(group1);

  const resultPops = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.DENOMINATOR_EXCLUSION,
    expected: true,
    actual: undefined,
  });

  expect(resultPops.length).toEqual(groupPopulations.length);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.INITIAL_POPULATION,
      "Ratio"
    ).name
  ).toEqual(PopulationType.INITIAL_POPULATION);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.DENOMINATOR,
      "Ratio"
    ).name
  ).toEqual(PopulationType.DENOMINATOR);
  expect(
    parsingTheExpectedResult(
      resultPops[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    ).id
  ).toEqual("3");

  const resultPops2 = triggerPopChanges(groupPopulations, group1.groupId, {
    name: PopulationType.NUMERATOR_EXCLUSION,
    expected: true,
    actual: undefined,
  });

  expect(
    parsingTheExpectedResult(
      resultPops2[0].populationValues,
      PopulationType.MEASURE_OBSERVATION,
      "Ratio"
    )
  ).toEqual(false);

  // const measureObserv3: PopulationValue = {
  //   name: PopulationType.MEASURE_OBSERVATION,
  //   expected: false,
  //   actual: false,
  //   id:'4',
  //   criteriaReference:'2'
  // };
  // populationValues.push(populationValues.push(measureObserv3))

  // const measureGroup={
  //   id:'id-1',
  //   measureObservations:[{

  //   }],
  //   populations:[]
  // }
  // const resultPops3 = triggerPopChanges(groupPopulations, group1.groupId, {
  //   name: PopulationType.NUMERATOR_EXCLUSION,
  //   expected: false,
  //   actual: undefined,
  // });
  // expect( parsingTheExpectedResult(
  //   resultPops3[0].populationValues,
  //   PopulationType.MEASURE_OBSERVATION,
  //   "Ratio"
  // )
  // ).toEqual(true);
});

// it("", ()=>{
//   group.scoring = "Ratio";
//   group.measureObservations = [
//     {
//       id: "uuid-1",
//       definition: "fun",
//       aggregateMethod: AggregateFunctionType.AVERAGE,
//       criteriaReference: "id-3",
//     },
//   ];
//   group.populations = [
//     {
//       id: "id-1",
//       name: PopulationType.INITIAL_POPULATION,
//       definition: "Initial Population",
//     },
//     {
//       id: "id-2",
//       name: PopulationType.DENOMINATOR,
//       definition: "Denominator",
//     },
//     {
//       id: "id-3",
//       name: PopulationType.NUMERATOR,
//       definition: "Numerator",
//     },
//   ];
//   measure.groups = [group];
// })

function parsingTheExpectedResult(
  popVals: PopulationValue[],
  name: String,
  scoring: string
): any {
  let returnVal = false;
  popVals.forEach((value: PopulationValue, index: number) => {
    if (value.name === name) {
      returnVal = scoring === "Proportion" ? value.expected : value;
    }
  });
  return returnVal;
}
