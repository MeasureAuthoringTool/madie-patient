export const stratificationExecutionResults = {
  "group-1": {
    IPP: 1,
    statement_relevance: {
      QDMStratificationTest: {
        Patient: "NA",
        "Qualifying Encounters": "TRUE",
        "Initial Population": "TRUE",
        "Stratificaction 1": "NA",
      },
    },
    population_relevance: {
      IPP: true,
    },
    statement_results: {
      QDMStratificationTest: {
        Patient: {
          raw: {},
          library_name: "QDMStratificationTest",
          statement_name: "Patient",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Qualifying Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          library_name: "QDMStratificationTest",
          statement_name: "Qualifying Encounters",
          relevance: "TRUE",
          final: "TRUE",
          pretty:
            "[Encounter, Performed: Office Visit\nSTART: 10/01/2021 12:00 AM\nSTOP: 10/02/2021 12:00 AM\nCODE: SNOMEDCT 185463005]",
        },
        "Initial Population": {
          raw: true,
          library_name: "QDMStratificationTest",
          statement_name: "Initial Population",
          relevance: "TRUE",
          final: "TRUE",
          pretty: "true",
        },
        "Stratificaction 1": {
          raw: true,
          library_name: "QDMStratificationTest",
          statement_name: "Stratificaction 1",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
      },
    },
    clause_results: {
      QDMStratificationTest: {
        "221": {
          raw: true,
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "221",
          final: "TRUE",
        },
        "222": {
          raw: true,
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "222",
          final: "TRUE",
        },
        "224": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "224",
          final: "TRUE",
        },
        "225": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "225",
          final: "TRUE",
        },
        "228": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "228",
          final: "TRUE",
        },
        "234": {
          raw: [],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "234",
          final: "FALSE",
        },
        "238": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "238",
          final: "TRUE",
        },
        "246": {
          raw: {
            low: "2021-10-01T00:00:00.000+00:00",
            high: "2021-10-02T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "246",
          final: "TRUE",
        },
        "251": {
          raw: {
            low: "2021-01-01T00:00:00.000+00:00",
            high: "2021-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "251",
          final: "TRUE",
        },
        "254": {
          raw: true,
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "254",
          final: "TRUE",
        },
        "256": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "256",
          final: "TRUE",
        },
        "261": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "261",
          final: "TRUE",
        },
        "267": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "267",
          final: "NA",
        },
        "268": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "268",
          final: "NA",
        },
        "269": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "269",
          final: "NA",
        },
        "270": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "270",
          final: "NA",
        },
        "276": {
          raw: {
            code: "185463005",
            system: "2.16.840.1.113883.6.96",
            version: "urn:hl7:version:2024-03",
            display: "Visit out of hours (procedure)",
          },
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "276",
          final: "NA",
        },
        "277": {
          raw: {
            oid: "2.16.840.1.113883.3.464.1003.101.12.1001",
            version: "20180310",
            codes: [
              {
                code: "185463005",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "185464004",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "185465003",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "3391000175108",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "439740005",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "99202",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99203",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99204",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99205",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99212",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99213",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99214",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99215",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
            ],
          },
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "277",
          final: "NA",
        },
        "278": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "278",
          final: "NA",
        },
        "279": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "279",
          final: "NA",
        },
      },
    },
    patient: "66fc253ea450c10000890c30",
    measure: "66fc29ff6dba8d000064f401",
    state: "complete",
  },
  PopulationSet_1_Stratification_1: {
    IPP: 1,
    STRAT: 1,
    statement_relevance: {
      QDMStratificationTest: {
        Patient: "NA",
        "Qualifying Encounters": "TRUE",
        "Initial Population": "TRUE",
        "Stratificaction 1": "TRUE",
      },
    },
    population_relevance: {
      IPP: true,
      STRAT: true,
    },
    statement_results: {
      QDMStratificationTest: {
        Patient: {
          raw: {},
          library_name: "QDMStratificationTest",
          statement_name: "Patient",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Qualifying Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          library_name: "QDMStratificationTest",
          statement_name: "Qualifying Encounters",
          relevance: "TRUE",
          final: "TRUE",
          pretty:
            "[Encounter, Performed: Office Visit\nSTART: 10/01/2021 12:00 AM\nSTOP: 10/02/2021 12:00 AM\nCODE: SNOMEDCT 185463005]",
        },
        "Initial Population": {
          raw: true,
          library_name: "QDMStratificationTest",
          statement_name: "Initial Population",
          relevance: "TRUE",
          final: "TRUE",
          pretty: "true",
        },
        "Stratificaction 1": {
          raw: true,
          library_name: "QDMStratificationTest",
          statement_name: "Stratificaction 1",
          relevance: "TRUE",
          final: "TRUE",
          pretty: "true",
        },
      },
    },
    clause_results: {
      QDMStratificationTest: {
        "221": {
          raw: true,
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "221",
          final: "TRUE",
        },
        "222": {
          raw: true,
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "222",
          final: "TRUE",
        },
        "224": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "224",
          final: "TRUE",
        },
        "225": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "225",
          final: "TRUE",
        },
        "228": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "228",
          final: "TRUE",
        },
        "234": {
          raw: [],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "234",
          final: "FALSE",
        },
        "238": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "238",
          final: "TRUE",
        },
        "246": {
          raw: {
            low: "2021-10-01T00:00:00.000+00:00",
            high: "2021-10-02T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "246",
          final: "TRUE",
        },
        "251": {
          raw: {
            low: "2021-01-01T00:00:00.000+00:00",
            high: "2021-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "251",
          final: "TRUE",
        },
        "254": {
          raw: true,
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "254",
          final: "TRUE",
        },
        "256": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMStratificationTest",
          localId: "256",
          final: "TRUE",
        },
        "261": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMStratificationTest",
          localId: "261",
          final: "TRUE",
        },
        "267": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "267",
          final: "TRUE",
        },
        "268": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "268",
          final: "TRUE",
        },
        "269": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "269",
          final: "TRUE",
        },
        "270": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "270",
          final: "TRUE",
        },
        "276": {
          raw: {
            code: "185463005",
            system: "2.16.840.1.113883.6.96",
            version: "urn:hl7:version:2024-03",
            display: "Visit out of hours (procedure)",
          },
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "276",
          final: "TRUE",
        },
        "277": {
          raw: {
            oid: "2.16.840.1.113883.3.464.1003.101.12.1001",
            version: "20180310",
            codes: [
              {
                code: "185463005",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "185464004",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "185465003",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "3391000175108",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "439740005",
                system: "2.16.840.1.113883.6.96",
                version: "20180310",
              },
              {
                code: "99202",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99203",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99204",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99205",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99212",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99213",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99214",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
              {
                code: "99215",
                system: "2.16.840.1.113883.6.12",
                version: "20180310",
              },
            ],
          },
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "277",
          final: "TRUE",
        },
        "278": {
          raw: true,
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "278",
          final: "TRUE",
        },
        "279": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "185463005",
                  system: "2.16.840.1.113883.6.96",
                  version: "urn:hl7:version:2024-03",
                  display: "Visit out of hours (procedure)",
                },
              ],
              _id: "66fc2552a450c10000890c3a",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Office Visit",
              codeListId: "2.16.840.1.113883.3.464.1003.101.12.1001",
              id: "66fc2552a450c10000890c39",
              relevantPeriod: {
                low: "2021-10-01T00:00:00.000+00:00",
                high: "2021-10-02T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
              facilityLocations: [],
              diagnoses: [],
            },
          ],
          statement_name: "Stratificaction 1",
          library_name: "QDMStratificationTest",
          localId: "279",
          final: "TRUE",
        },
      },
    },
    patient: "66fc253ea450c10000890c30",
    measure: "66fc29ff6dba8d000064f401",
    state: "complete",
  },
};

export const stratificationTestMeasure = {
  id: "66fc246aa3eb80250fe9a655",
  cql_libraries: [
    {
      library_name: "QDMStratificationTest",
      library_version: "0.0.000",
      elm: {
        library: {
          annotation: [
            {
              translatorVersion: "3.14.0",
              signatureLevel: "None",
              type: "CqlToElmInfo",
              translatorOptions:
                "EnableAnnotations,EnableLocators,EnableResultTypes,EnableDetailedErrors,DisableListDemotion,DisableListPromotion",
            },
            {
              s: {
                r: "267",
                s: [
                  {
                    value: [
                      "",
                      "library QDMStratificationTest version '0.0.000'",
                    ],
                  },
                ],
              },
              type: "Annotation",
            },
          ],
          identifier: {
            id: "QDMStratificationTest",
            version: "0.0.000",
          },
          usings: {
            def: [
              {
                localIdentifier: "System",
                localId: "1",
                uri: "urn:hl7-org:elm-types:r1",
              },
              {
                annotation: [
                  {
                    s: {
                      r: "206",
                      s: [
                        {
                          value: ["", "using "],
                        },
                        {
                          s: [
                            {
                              value: ["QDM"],
                            },
                          ],
                        },
                        {
                          value: [" version '5.6'"],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                localIdentifier: "QDM",
                localId: "206",
                locator: "3:1-3:23",
                uri: "urn:healthit-gov:qdm:v5_6",
                version: "5.6",
              },
            ],
          },
          valueSets: {
            def: [
              {
                annotation: [
                  {
                    s: {
                      r: "207",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Office Visit"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1001'",
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                codeSystem: [],
                accessLevel: "Public",
                name: "Office Visit",
                id: "2.16.840.1.113883.3.464.1003.101.12.1001",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                localId: "207",
                locator: "5:1-5:75",
              },
              {
                annotation: [
                  {
                    s: {
                      r: "208",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Annual Wellness Visit"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.3.526.3.1240'",
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                codeSystem: [],
                accessLevel: "Public",
                name: "Annual Wellness Visit",
                id: "2.16.840.1.113883.3.526.3.1240",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                localId: "208",
                locator: "6:1-6:74",
              },
            ],
          },
          statements: {
            def: [
              {
                expression: {
                  signature: [],
                  type: "SingletonFrom",
                  localId: "218",
                  operand: {
                    otherFilter: [],
                    include: [],
                    dataType: "{urn:healthit-gov:qdm:v5_6}Patient",
                    templateId: "Patient",
                    type: "Retrieve",
                    localId: "216",
                    locator: "10:1-10:15",
                    codeFilter: [],
                    dateFilter: [],
                  },
                },
                name: "Patient",
                context: "Patient",
                localId: "217",
                locator: "10:1-10:15",
              },
              {
                annotation: [
                  {
                    s: {
                      r: "224",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Qualifying Encounters"',
                            ":\n   ",
                          ],
                        },
                        {
                          r: "256",
                          s: [
                            {
                              s: [
                                {
                                  r: "225",
                                  s: [
                                    {
                                      r: "238",
                                      s: [
                                        {
                                          value: ["(\n        "],
                                        },
                                        {
                                          r: "238",
                                          s: [
                                            {
                                              r: "228",
                                              s: [
                                                {
                                                  value: [
                                                    "[",
                                                    '"Encounter, Performed"',
                                                    ": ",
                                                  ],
                                                },
                                                {
                                                  s: [
                                                    {
                                                      value: ['"Office Visit"'],
                                                    },
                                                  ],
                                                },
                                                {
                                                  value: ["]"],
                                                },
                                              ],
                                            },
                                            {
                                              value: ["\n        union "],
                                            },
                                            {
                                              r: "234",
                                              s: [
                                                {
                                                  value: [
                                                    "[",
                                                    '"Encounter, Performed"',
                                                    ": ",
                                                  ],
                                                },
                                                {
                                                  s: [
                                                    {
                                                      value: [
                                                        '"Annual Wellness Visit"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                                {
                                                  value: ["]"],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          value: ["\n    )"],
                                        },
                                      ],
                                    },
                                    {
                                      value: [" ", "ValidEncounter"],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              value: ["\n    "],
                            },
                            {
                              r: "254",
                              s: [
                                {
                                  value: ["where "],
                                },
                                {
                                  r: "254",
                                  s: [
                                    {
                                      r: "246",
                                      s: [
                                        {
                                          r: "245",
                                          s: [
                                            {
                                              value: ["ValidEncounter"],
                                            },
                                          ],
                                        },
                                        {
                                          value: ["."],
                                        },
                                        {
                                          r: "246",
                                          s: [
                                            {
                                              value: ["relevantPeriod"],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      r: "254",
                                      value: [" ", "during", " "],
                                    },
                                    {
                                      r: "251",
                                      s: [
                                        {
                                          value: ['"Measurement Period"'],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                resultTypeSpecifier: {
                  type: "ListTypeSpecifier",
                  localId: "264",
                  elementType: {
                    name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                    type: "NamedTypeSpecifier",
                    localId: "265",
                  },
                },
                expression: {
                  resultTypeSpecifier: {
                    type: "ListTypeSpecifier",
                    localId: "257",
                    elementType: {
                      name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      type: "NamedTypeSpecifier",
                      localId: "258",
                    },
                  },
                  let: [],
                  where: {
                    signature: [],
                    resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                    type: "IncludedIn",
                    localId: "254",
                    locator: "20:5-20:67",
                    operand: [
                      {
                        path: "relevantPeriod",
                        resultTypeSpecifier: {
                          pointType: {
                            name: "{urn:hl7-org:elm-types:r1}DateTime",
                            type: "NamedTypeSpecifier",
                            localId: "250",
                          },
                          type: "IntervalTypeSpecifier",
                          localId: "249",
                        },
                        scope: "ValidEncounter",
                        type: "Property",
                        localId: "246",
                        locator: "20:11-20:39",
                      },
                      {
                        resultTypeSpecifier: {
                          pointType: {
                            name: "{urn:hl7-org:elm-types:r1}DateTime",
                            type: "NamedTypeSpecifier",
                            localId: "253",
                          },
                          type: "IntervalTypeSpecifier",
                          localId: "252",
                        },
                        name: "Measurement Period",
                        type: "ParameterRef",
                        localId: "251",
                        locator: "20:48-20:67",
                      },
                    ],
                  },
                  source: [
                    {
                      resultTypeSpecifier: {
                        type: "ListTypeSpecifier",
                        localId: "243",
                        elementType: {
                          name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                          type: "NamedTypeSpecifier",
                          localId: "244",
                        },
                      },
                      expression: {
                        resultTypeSpecifier: {
                          type: "ListTypeSpecifier",
                          localId: "241",
                          elementType: {
                            name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            type: "NamedTypeSpecifier",
                            localId: "242",
                          },
                        },
                        signature: [],
                        type: "Union",
                        localId: "238",
                        locator: "16:4-19:5",
                        operand: [
                          {
                            otherFilter: [],
                            codes: {
                              name: "Office Visit",
                              preserve: true,
                              resultTypeName:
                                "{urn:hl7-org:elm-types:r1}ValueSet",
                              type: "ValueSetRef",
                              localId: "227",
                              locator: "17:34-17:47",
                            },
                            include: [],
                            resultTypeSpecifier: {
                              type: "ListTypeSpecifier",
                              localId: "230",
                              elementType: {
                                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                                type: "NamedTypeSpecifier",
                                localId: "231",
                              },
                            },
                            dataType:
                              "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            templateId: "PositiveEncounterPerformed",
                            type: "Retrieve",
                            localId: "228",
                            codeComparator: "in",
                            codeFilter: [],
                            dateFilter: [],
                            codeProperty: "code",
                            locator: "17:9-17:48",
                          },
                          {
                            otherFilter: [],
                            codes: {
                              name: "Annual Wellness Visit",
                              preserve: true,
                              resultTypeName:
                                "{urn:hl7-org:elm-types:r1}ValueSet",
                              type: "ValueSetRef",
                              localId: "233",
                              locator: "18:40-18:62",
                            },
                            include: [],
                            resultTypeSpecifier: {
                              type: "ListTypeSpecifier",
                              localId: "236",
                              elementType: {
                                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                                type: "NamedTypeSpecifier",
                                localId: "237",
                              },
                            },
                            dataType:
                              "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            templateId: "PositiveEncounterPerformed",
                            type: "Retrieve",
                            localId: "234",
                            codeComparator: "in",
                            codeFilter: [],
                            dateFilter: [],
                            codeProperty: "code",
                            locator: "18:15-18:63",
                          },
                        ],
                      },
                      alias: "ValidEncounter",
                      localId: "225",
                      locator: "16:4-19:20",
                    },
                  ],
                  type: "Query",
                  relationship: [],
                  localId: "256",
                  locator: "16:4-20:67",
                },
                accessLevel: "Public",
                name: "Qualifying Encounters",
                context: "Patient",
                localId: "224",
                locator: "15:1-20:67",
              },
              {
                annotation: [
                  {
                    s: {
                      r: "221",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Initial Population"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "222",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "261",
                              s: [
                                {
                                  value: ['"Qualifying Encounters"'],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                expression: {
                  signature: [],
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  localId: "222",
                  locator: "13:3-13:32",
                  operand: {
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      localId: "262",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        type: "NamedTypeSpecifier",
                        localId: "263",
                      },
                    },
                    name: "Qualifying Encounters",
                    type: "ExpressionRef",
                    localId: "261",
                    locator: "13:10-13:32",
                  },
                },
                accessLevel: "Public",
                name: "Initial Population",
                context: "Patient",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                localId: "221",
                locator: "12:1-13:32",
              },
              {
                annotation: [
                  {
                    s: {
                      r: "267",
                      s: [
                        {
                          value: ["", "define ", '"Stratificaction 1"', ":\n "],
                        },
                        {
                          r: "268",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "279",
                              s: [
                                {
                                  value: ["("],
                                },
                                {
                                  r: "279",
                                  s: [
                                    {
                                      s: [
                                        {
                                          r: "269",
                                          s: [
                                            {
                                              r: "270",
                                              s: [
                                                {
                                                  s: [
                                                    {
                                                      value: [
                                                        '"Qualifying Encounters"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                            {
                                              value: [" ", "Enc"],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      value: ["\n    "],
                                    },
                                    {
                                      r: "278",
                                      s: [
                                        {
                                          value: ["where "],
                                        },
                                        {
                                          r: "278",
                                          s: [
                                            {
                                              r: "276",
                                              s: [
                                                {
                                                  r: "275",
                                                  s: [
                                                    {
                                                      value: ["Enc"],
                                                    },
                                                  ],
                                                },
                                                {
                                                  value: ["."],
                                                },
                                                {
                                                  r: "276",
                                                  s: [
                                                    {
                                                      value: ["code"],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                            {
                                              value: [" in "],
                                            },
                                            {
                                              r: "277",
                                              s: [
                                                {
                                                  value: ['"Office Visit"'],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  value: [")"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                expression: {
                  signature: [],
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  localId: "268",
                  locator: "24:2-25:37",
                  operand: {
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      localId: "282",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        type: "NamedTypeSpecifier",
                        localId: "283",
                      },
                    },
                    let: [],
                    where: {
                      code: {
                        path: "code",
                        scope: "Enc",
                        resultTypeName: "{urn:hl7-org:elm-types:r1}Code",
                        type: "Property",
                        localId: "276",
                        locator: "25:11-25:18",
                      },
                      valueset: {
                        name: "Office Visit",
                        preserve: true,
                        resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                        localId: "277",
                        locator: "25:23-25:36",
                      },
                      signature: [],
                      resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                      type: "InValueSet",
                      localId: "278",
                      locator: "25:5-25:36",
                    },
                    source: [
                      {
                        resultTypeSpecifier: {
                          type: "ListTypeSpecifier",
                          localId: "273",
                          elementType: {
                            name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            type: "NamedTypeSpecifier",
                            localId: "274",
                          },
                        },
                        expression: {
                          resultTypeSpecifier: {
                            type: "ListTypeSpecifier",
                            localId: "271",
                            elementType: {
                              name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                              type: "NamedTypeSpecifier",
                              localId: "272",
                            },
                          },
                          name: "Qualifying Encounters",
                          type: "ExpressionRef",
                          localId: "270",
                          locator: "24:10-24:32",
                        },
                        alias: "Enc",
                        localId: "269",
                        locator: "24:10-24:36",
                      },
                    ],
                    type: "Query",
                    relationship: [],
                    localId: "279",
                    locator: "24:9-25:37",
                  },
                },
                accessLevel: "Public",
                name: "Stratificaction 1",
                context: "Patient",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                localId: "267",
                locator: "23:1-25:37",
              },
            ],
          },
          schemaIdentifier: {
            id: "urn:hl7-org:elm",
            version: "r1",
          },
          contexts: {
            def: [
              {
                name: "Patient",
                localId: "219",
                locator: "10:1-10:15",
              },
            ],
          },
          localId: "0",
          parameters: {
            def: [
              {
                annotation: [
                  {
                    s: {
                      r: "209",
                      s: [
                        {
                          value: [
                            "",
                            "parameter ",
                            '"Measurement Period"',
                            " ",
                          ],
                        },
                        {
                          r: "210",
                          s: [
                            {
                              value: ["Interval<"],
                            },
                            {
                              r: "211",
                              s: [
                                {
                                  value: ["DateTime"],
                                },
                              ],
                            },
                            {
                              value: [">"],
                            },
                          ],
                        },
                      ],
                    },
                    type: "Annotation",
                  },
                ],
                resultTypeSpecifier: {
                  pointType: {
                    name: "{urn:hl7-org:elm-types:r1}DateTime",
                    type: "NamedTypeSpecifier",
                    localId: "215",
                  },
                  type: "IntervalTypeSpecifier",
                  localId: "214",
                },
                accessLevel: "Public",
                name: "Measurement Period",
                parameterTypeSpecifier: {
                  resultTypeSpecifier: {
                    pointType: {
                      name: "{urn:hl7-org:elm-types:r1}DateTime",
                      type: "NamedTypeSpecifier",
                      localId: "213",
                    },
                    type: "IntervalTypeSpecifier",
                    localId: "212",
                  },
                  pointType: {
                    name: "{urn:hl7-org:elm-types:r1}DateTime",
                    resultTypeName: "{urn:hl7-org:elm-types:r1}DateTime",
                    type: "NamedTypeSpecifier",
                    localId: "211",
                    locator: "8:41-8:48",
                  },
                  type: "IntervalTypeSpecifier",
                  localId: "210",
                  locator: "8:32-8:49",
                },
                localId: "209",
                locator: "8:1-8:49",
              },
            ],
          },
        },
      },
    },
  ],
  population_sets: [
    {
      id: "group-1",
      title: "Population Criteria Section",
      population_set_id: "group-1",
      populations: {
        "@class": "gov.cms.madie.models.cqm.CohortPopulationMap",
        IPP: {
          id: "9ed75c6b-cdb1-497d-8241-aa37ee61088b",
          library_name: "QDMStratificationTest",
          statement_name: "Initial Population",
          hqmf_id: null,
        },
      },
      stratifications: [
        {
          id: "913cd88f-c6d6-4760-a220-68e8d4bd596e",
          title: "PopSet1 Stratification 1",
          stratification_id: "PopulationSet_1_Stratification_1",
          hqmf_id: null,
          statement: {
            id: "a65b9b3a-1630-4fbb-9db9-0c797cf314eb",
            library_name: "QDMStratificationTest",
            statement_name: "Stratificaction 1",
            hqmf_id: null,
          },
        },
      ],
      supplemental_data_elements: [],
      observations: [],
    },
  ],
};
