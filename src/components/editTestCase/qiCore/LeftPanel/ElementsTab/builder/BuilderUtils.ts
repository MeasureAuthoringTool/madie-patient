import axios from "axios";
import IdentifierInput from "../../../../../common/Identifier/IdentifierInput";

export class BuilderUtils {
  async getResources() {
    const response = await axios.get<any>(`http://localhost:3001/resources`, {
      headers: {},
    });
    return response.data;
  }

  static async getResourceTree(resourceName) {
    const response = await axios.get<any>(
      `http://localhost:3001/structure-definitions/${resourceName}`
    );
    console.log("response: ", response);
    return response.data;
  }

  async getResourceTree(resourceName) {
    return BuilderUtils.getResourceTree(resourceName);
  }

  static getBasePath(resource: any): string {
    const elements = [...resource?.definition?.snapshot?.element];
    return elements?.[0].path;
  }

  static buildElementTree(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const tree = {};
    elements.forEach((e) => {
      const parentLen = e.path.lastIndexOf(".");
      const parent = parentLen > 0 ? e.path.substring(0, parentLen) : e.path;
      const self = parentLen > 0 ? e.path.substring(parentLen + 1) : e.path;
      if (tree[parent]) {
        tree[parent] = {
          ...tree[parent],
          [self]: { ...e },
        };
      } else {
        tree[e.path] = {
          element: e,
        };
      }
      // }
    });
    console.log("tree: ", tree);
    // const basePath = elements?.shift()?.path;
    // console.log("buildElementTree.resource: ", resource);
    // const nextElements = elements.map((e) => {
    //   return {
    //     ...e,
    //     path: e.path.substring(basePath.length + 1),
    //   };
    // });
    // console.log("buildElementTree.nextElements:", nextElements);
  }

  static getAllElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    // console.log("elements: ", elements);
    const nextElements = elements?.filter(
      (e) => e.path.split(".")?.length === 2
    );
    console.log("getRequiredElements.nextElements: ", nextElements);
    return nextElements;
  }

  static getRequiredElements(resource: any) {
    const elements = [...resource?.definition?.snapshot?.element];
    const basePath = this.getBasePath(resource);
    // console.log("elements: ", elements);
    const nextElements = elements?.filter(
      (e) => e.min > 0 && e.path.split(".")?.length === 2
    );
    console.log("getRequiredElements.nextElements: ", nextElements);
    return nextElements;
  }
}
