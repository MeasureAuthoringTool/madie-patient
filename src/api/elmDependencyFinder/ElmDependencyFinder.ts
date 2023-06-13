export class ElmDependencyFinder {
  async findDependencies(
    cqlLibraryElms: Array<string>,
    mainCqlLibraryName: string
  ) {
    let neededElmDepsMap = {};
    let allElmsDepMap = {};
    cqlLibraryElms.forEach((elm) => {
      const elmJson = JSON.parse(elm);
      const elmId: string = elmJson.library?.identifier?.id;
      neededElmDepsMap[elmId] = {};
      allElmsDepMap[elmId] = this.makeStatementDepsForElm(elmJson);
    });
    neededElmDepsMap[mainCqlLibraryName] = allElmsDepMap[mainCqlLibraryName];
    Object.values(neededElmDepsMap[mainCqlLibraryName]).forEach(
      (statements: Array<object>) => {
        statements.forEach((statement: object) => {
          this.deepAddExternalLibraryDeps(
            statement,
            neededElmDepsMap,
            allElmsDepMap
          );
        });
      }
    );
    return neededElmDepsMap;
  }

  private makeStatementDepsForElm(elmJson: any) {
    const elmDeps = {};
    const includedLibrariesMap = this.getIncludedLibrariesMap(elmJson);
    const libraryId = elmJson.library?.identifier?.id;
    this.generateStatementDepsForElmHelper(
      elmJson,
      libraryId,
      null,
      elmDeps,
      includedLibrariesMap
    );
    // Do I need to make sure the elmDeps has unique values ?
    return elmDeps;
  }

  /*
    generates a map of localIdentifier and actual included library
    returns {
      Global: MATGlobalCommonFunctions,
      SDE: SupplementalDataElements
    }
  */
  private getIncludedLibrariesMap(elmJson: any) {
    const includedLibrariesMap = {};
    includedLibrariesMap[elmJson.library?.identifier?.id] =
      elmJson.library?.identifier?.id;
    elmJson.library?.includes?.def?.forEach((def) => {
      includedLibrariesMap[def.localIdentifier] = def.path;
    });
    return includedLibrariesMap;
  }

  /*
    Generates a map elmDeps, statementName mapping to its expression references
    If the reference expression is in the same library, it is mapped to same library
    If the reference expression is in the included library, then it is mapped to external Library
  */
  private generateStatementDepsForElmHelper(
    obj: any,
    libraryId: string,
    parentName: string,
    elmDeps: {},
    includedLibrariesMap: any
  ): void {
    if (Array.isArray(obj)) {
      obj.forEach((el) =>
        this.generateStatementDepsForElmHelper(
          el,
          libraryId,
          parentName,
          elmDeps,
          includedLibrariesMap
        )
      );
    } else if (typeof obj === "object") {
      if (
        ["ExpressionRef", "FunctionRef"].includes(obj.type) &&
        parentName !== "Patient"
      ) {
        let dep;
        if (!includedLibrariesMap[obj.libraryName]) {
          dep = {
            library_name: libraryId,
            statement_name: obj.name,
          };
        } else {
          dep = {
            library_name: includedLibrariesMap[obj.libraryName],
            statement_name: obj.name,
          };
        }
        elmDeps[parentName].push(dep);
      } else if (obj.name && obj.expression) {
        parentName = obj.name;
        if (!elmDeps[parentName]) {
          elmDeps[parentName] = [];
        }
      }
      Object.entries(obj).forEach(([k, v]) => {
        if (k !== "annotation") {
          this.generateStatementDepsForElmHelper(
            v,
            libraryId,
            parentName,
            elmDeps,
            includedLibrariesMap
          );
        }
      });
    }
  }

  /*
    For every external statement reference used in library, ( ex: Global.LengthInDays )
    Fetch the statement from external library along with all its statement references and add it to the neededElmDepsMap
  */
  private deepAddExternalLibraryDeps(
    statement: any,
    neededElmDepsMap: {},
    allElmsDepMap: {}
  ) {
    const statementLibrary = statement.library_name;
    const statementName = statement.statement_name;

    if (neededElmDepsMap[statementLibrary]?.[statementName] !== undefined) {
      return; // Return if key already exists
    }

    if (allElmsDepMap[statementLibrary] === undefined) {
      throw new Error(
        `Elm library ${statementLibrary} referenced but not found.`
      );
    }

    if (allElmsDepMap[statementLibrary][statementName] === undefined) {
      throw new Error(
        `Elm statement '${statementName}' referenced but not found in library '${statementLibrary}'.`
      );
    }

    const depsToAdd = allElmsDepMap[statementLibrary][statementName];
    neededElmDepsMap[statementLibrary] = {
      ...neededElmDepsMap[statementLibrary],
      [statementName]: depsToAdd,
    };

    depsToAdd.forEach((statement) => {
      this.deepAddExternalLibraryDeps(
        statement,
        neededElmDepsMap,
        allElmsDepMap
      );
    });
  }
}
