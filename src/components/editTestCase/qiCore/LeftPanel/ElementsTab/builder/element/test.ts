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

// given a list and depth, determine weather we shuold split array into two
// current depth at root should be 3.
// export const transformArrays = (list, depth) => {
export const transformArrays = (list, depth) => {
  depth = depth - 1;
  // returns an array of arrays by branches, or a single array of one array
  let branchNames = [];
  let numberOfBranchesAtDepth = 0;
  const result = [];
  list.forEach((item) => {
    const targetPath = item.id.split(".")[depth];
    if (item.id.split(".")[depth + 1]) {
      // it can go deeper.
      if (!branchNames.includes(targetPath)) {
        branchNames.push(targetPath);
        numberOfBranchesAtDepth++;
      }
    }
  });
  if (!numberOfBranchesAtDepth) {
    // no branches just return list
    return [list];
  } else {
    const memory = {};

    list.forEach((item) => {
      const targetPath = item.id.split(".")[depth];
      if (branchNames.includes(targetPath)) {
        // if not present, we will initialize
        if (!memory[targetPath]) {
          memory[targetPath] = [];
        }
        memory[targetPath].push(item);
      }
    });
    // iterate thru keys in object -> push [] return
    for (const key in memory) {
      result.push(memory[key]);
    }
  }
  return result;
};
