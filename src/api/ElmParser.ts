import { JSONPath } from "jsonpath-plus";

class TextObj {
  text: string;
}
class ChildObj {
  children: any[] = [];

  node_type: string;
  ref_id: string;
}
class StatementObj {
  children: ChildObj[] = [];
  define_name: string;
}
class AnnotationObj {
  statements: StatementObj[] = [];
  identifier: any = {};
}
export const parse = (elmJson) => {
  //This is what MITRE Cql Parser (ruby) returns
  //  Statements is an array of nodes
  // identifier is an object that contains "Id,Version" pairs for

  const ret: AnnotationObj = new AnnotationObj();
  const localid_to_type_map = {};
  let nodes = [];

  ["expression", "operand", "suchThat"].forEach((element) => {
    //use a css selector to find all "field"s with either localId, xsi, or type
    //nodes = elmJson.css(field + '[localId][xsi|type]')
    //  * search for all nodes that contain "element, localID and type"
    const path = `$.[?(@.${element})].[?(@.localId && @.type)]`;
    const newNodes = JSONPath({ path: path, json: elmJson });
    nodes.push(...newNodes);
    nodes.forEach((node) => {
      localid_to_type_map[node["localId"]] = node["type"];
    });
  });

  //extract library identifier data
  ret.identifier.id = JSONPath({
    path: "$.library.identifier.id",
    json: elmJson,
  })[0];
  ret.identifier.version = JSONPath({
    path: "$.library.identifier.version",
    json: elmJson,
  })[0];
  //all the define statements including functions
  const annotations = JSONPath({
    path: "$.library.statements.def.[?(@.annotation)]",
    json: elmJson,
  });

  let index: number = 0;
  annotations.forEach((annotation) => {
    Object.keys(annotation).forEach((key) => {
      if (key === "annotation") {
        ret.statements[0] = new StatementObj();
        ret.statements[0].children[index] = new ChildObj();

        parse_node(
          annotation[key],
          ret.statements[0].children[index++],
          localid_to_type_map
        );
      }
    });
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

function parse_node(node: any, output: ChildObj, localid_to_type_map: any) {
  Object.keys(node).forEach((key) => {
    const childIdx = output.children.push(new ChildObj()) - 1;
    if (!!node[key] && typeof node[key] === "object") {
      if (node["r"]) {
        let node_type = localid_to_type_map[node["r"]];
        if (node_type != undefined) {
          output.children[childIdx].node_type = node_type;
        }
        output.children[childIdx].ref_id = node["r"];
      }
      const result: any = parse_node(
        node[key],
        output.children[childIdx],
        localid_to_type_map
      );
      if (node[key].value) {
        node[key].value.forEach((value) => {
          if (value) {
            let textObj = new TextObj();
            textObj.text = value;
            output.children[childIdx].children.push(textObj);
          }
        });
      }
    }
    if (
      typeof output.children[childIdx].children === undefined ||
      output.children[childIdx].children.length === 0
    ) {
      const removed = output.children.pop();
    }
  });
}
export default { parse };
