import { JSONPath } from "jsonpath-plus";

type Identifier = {
  id: string;
  version: string;
};
// statements is an array of nodes
// identifier is an object that contains "id, Version" pairs
class Annotation {
  statements = [];
  identifier: Identifier;
}
export const parse = (elmJson) => {
  const ret: Annotation = new Annotation();
  const localIdToTypeMap = {};

  ["expression", "operand", "suchThat"].forEach((element) => {
    // Search for all nodes that contain "element, localId and type"
    const path = `$.[?(@.${element})].[?(@.localId && @.type)]`;
    const nodes = JSONPath({ path: path, json: elmJson });
    nodes.forEach((node) => {
      localIdToTypeMap[node["localId"]] = node["type"];
    });
  });

  //extract library identifier & version
  ret.identifier = {
    id: elmJson.library?.identifier.id,
    version: elmJson.library?.identifier.version,
  } as Identifier;

  //all the define statements including functions
  const definitions = JSONPath({
    path: "$.library.statements.def.[?(@.annotation)]",
    json: elmJson,
  });

  definitions.forEach((definition) => {
    const annotation = definition.annotation;
    const node = parseNode(annotation, localIdToTypeMap);
    node["define_name"] = definition.name;
    ret.statements.push(node);
  });
  return ret;
};

function removeNewlines(str) {
  //remove line breaks from str
  str = str.replace(/\s{2,}/g, " ");
  str = str.replace(/\t/g, " ");
  str = str
    .toString()
    .trim()
    .replace(/(\r\n|\n|\r)/g, "");
  return str;
}

function parseNode(node, localIdToTypeMap) {
  let parsedNode = { children: [] };
  Object.keys(node).forEach((key) => {
    const child = node[key];
    if (!child || key == "t" || typeof child === "string") return;
    if (child.value) {
      const text = Array.isArray(child.value)
        ? child.value.join(" ")
        : child.value;
      parsedNode.children.push({ children: [{ text: removeNewlines(text) }] });
    } else {
      let nodeType;
      if (child?.r) {
        nodeType = localIdToTypeMap[child.r];
      }
      let nextNode = parseNode(child, localIdToTypeMap);
      if (nodeType) {
        nextNode["node_type"] = nodeType;
      }
      if (child.r) {
        nextNode["ref_id"] = child.r;
      }
      parsedNode.children.push(nextNode);
    }
  });
  return parsedNode;
}
export default { parse };
