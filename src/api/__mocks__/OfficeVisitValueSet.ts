export const officeVisitValueSet: fhir4.ValueSet = {
  resourceType: "ValueSet",
  id: "2.16.840.1.113883.3.464.1003.101.12.1001",
  url: "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001",
  version: "N/A",
  name: "Office Visit",
  title: "Office Visit",
  status: "active",
  date: "2022-06-01T00:00:00-04:00",
  publisher: "National Committee for Quality Assurance",
  compose: {
    include: [
      {
        system: "2.16.840.1.113883.6.96",
        version: "2022-03",
        concept: [
          {
            code: "185463005",
            display: "Visit out of hours (procedure)",
          },
          {
            code: "185464004",
            display: "Out of hours visit - not night visit (procedure)",
          },
          {
            code: "185465003",
            display: "Weekend visit (procedure)",
          },
          {
            code: "3391000175108",
            display:
              "Office visit for pediatric care and assessment (procedure)",
          },
          {
            code: "439740005",
            display: "Postoperative follow-up visit (procedure)",
          },
        ],
      },
    ],
  },
};
