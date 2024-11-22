/*
i,o,c,e
input: Array of objects, with proprty.path that we care about
o: Multiple arrays of objects split by common ancestor path break point. 
c: none
e: no common anscestor break point
*/
// export const groupByNormalizedPrefix = (data) => {
export const groupByFirstSplit = (data) => {
  // const groupByFirstSplit = (data) => {

  // Get first item's path segments as initial reference
  const firstPath = data[0].id.split(".");

  // Find the split point by comparing paths
  let splitIndex = -1;
  let splitPaths = new Set();

  // For each segment depth
  for (let i = 0; i < firstPath.length; i++) {
    // Get all unique segments at this depth
    const segmentsAtDepth = new Set(data.map((item) => item.id.split(".")[i]));

    // If we find more than one unique segment at this depth,
    // we've found our split point
    if (segmentsAtDepth.size > 1) {
      splitIndex = i;
      splitPaths = segmentsAtDepth;
      break;
    }
  }

  // If no split found or split index is -1, return all items in one group
  if (splitIndex === -1) {
    return [data];
  }

  // Group items based on their path at the split point
  const result = [];
  for (const splitPath of splitPaths) {
    const group = data.filter((item) => {
      const segments = item.id.split(".");
      return segments[splitIndex] === splitPath;
    });
    result.push(group);
  }

  return result;
};

// Test data
const testData = [
  { id: "ClaimResponse.item.adjudication.id" },
  { id: "ClaimResponse.item.adjudication.extension" },
  { id: "ClaimResponse.item.adjudication.modifierExtension" },
  { id: "ClaimResponse.item.adjudication.category" },
  { id: "ClaimResponse.item.adjudication.reason" },
  { id: "ClaimResponse.item.adjudication.amount" },
  { id: "ClaimResponse.item.adjudication.value" },
  { id: "ClaimResponse.item.detail.id" },
  { id: "ClaimResponse.item.detail.extension" },
  { id: "ClaimResponse.item.detail.modifierExtension" },
  { id: "ClaimResponse.item.detail.detailSequence" },
  { id: "ClaimResponse.item.detail.noteNumber" },
  { id: "ClaimResponse.item.detail.adjudication" },
  { id: "ClaimResponse.item.detail.subDetail" },
  { id: "ClaimResponse.item.detail.subDetail.id" },
  { id: "ClaimResponse.item.detail.subDetail.extension" },
  { id: "ClaimResponse.item.detail.subDetail.modifierExtension" },
  { id: "ClaimResponse.item.detail.subDetail.subDetailSequence" },
  { id: "ClaimResponse.item.detail.subDetail.noteNumber" },
  { id: "ClaimResponse.item.detail.subDetail.adjudication" },
];

// const result = groupByFirstSplit(testData);

// // Direct console output without JSON.stringify
console.log(groupByFirstSplit(testData));

// const testData2 = [
//     { id: 'ClaimResponse.item.detail.id' },
//     { id: 'ClaimResponse.item.detail.extension' },
//     { id: 'ClaimResponse.item.detail.modifierExtension' },
//     { id: 'ClaimResponse.item.detail.detailSequence' },
//     { id: 'ClaimResponse.item.detail.noteNumber' },
//     { id: 'ClaimResponse.item.detail.adjudication' },
//     { id: 'ClaimResponse.item.detail.subDetail' },
//     { id: 'ClaimResponse.item.detail.subDetail.id' },
//     { id: 'ClaimResponse.item.detail.subDetail.extension' },
//     { id: 'ClaimResponse.item.detail.subDetail.modifierExtension' },
//     { id: 'ClaimResponse.item.detail.subDetail.subDetailSequence' },
//     { id: 'ClaimResponse.item.detail.subDetail.noteNumber' },
//     { id: 'ClaimResponse.item.detail.subDetail.adjudication' }
//   ]
//   console.log(groupByFirstSplit(testData2))
