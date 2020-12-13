/*
 * A ProjectStructure knows which types of assets live in which directory.
 * (It represents the "opinionated" conventions of a project and search platform,
 * though it can be customized).
 *
 * Sample:
 ```
    {
      "index": {
        "src": {
          "dir": "index",
          "extension": ["ts", "js"]
        },
        "install": {
          "dir": "../install/index",
          "extension": ".json"
        },
        "deploy": {
          "name_prefix": "index_"
        }
      },
      "query": {
        "src": {
          "dir": "query",
          "extension": ["ts", "js"],
        },
        "install": {
          "dir": "query",
          "extension": ".mustache"
        },
        "deploy": {
          "name_prefix": "query_"
        }
     }
   }
 ```
 */


export class ProjectStructure {
  _definitionTypes;

  constructor(definitionTypes) {
    this._definitionTypes = definitionTypes;
  }


  types() {
    return this._definitionTypes
      .map(dt => dt.type);
  }

  srcPathForType(type: string) {
    const matchingSrc = this._definitionTypes
      .filter(dt => dt.type === type)
      .map(dt => dt.src);

    // TODO:  Can we validate ProjectStructure with JSONSchema, so we don't need all this cruft?
    if (matchingSrc.length === 0) {
      return null;
    }

    if (!("dir" in matchingSrc[0]) || !("extension" in matchingSrc[0])) {
      return null;
    }

    return `${matchingSrc[0].dir}/*.@(${matchingSrc[0].extension.join("|")})`;
  }

  definitionNameFromSrcPath(definitionSrcPath: string, type: string) {
    const matchingSrc = this._definitionTypes
      .filter(dt => dt.type === type)
      .map(dt => dt.src);

    // TODO:  Can we validate ProjectStructure with JSONSchema, so we don't need all this cruft?
    if (matchingSrc.length === 0) {
      return null;
    }

    if (!("dir" in matchingSrc[0]) || !("extension" in matchingSrc[0])) {
      return null;
    }

    const re = new RegExp(`${matchingSrc[0].dir}/([-a-zA-Z0-9_]+).(?:${matchingSrc[0].extension.join("|")})`);
    const matches = re.exec(definitionSrcPath);
    if (!matches || matches.length < 2) {
      console.log(`No ${type} matching expression ${re} found in ${definitionSrcPath}`);
      return null;
    }

    return matches[1];
  }

  installPath(name: string, type: string) {
    const matchingInstall = this._definitionTypes
      .filter(dt => dt.type === type)
      .map(dt => dt.install);

    // TODO:  Can we validate ProjectStructure with JSONSchema, so we don't need all this cruft?
    if (matchingInstall.length === 0) {
      return null;
    }

    if (!("dir" in matchingInstall[0]) || !("extension" in matchingInstall[0])) {
      return null;
    }

    return matchingInstall[0].dir
      + "/"
      + name
      + matchingInstall[0].extension;
  }

  deployedName(name: string, type: string): string {
    const matchingDeploy = this._definitionTypes
      .filter(dt => dt.type === type)
      .map(dt => dt.deploy);

    if (matchingDeploy.length === 0) {
      return null;
    }

    if (!("name_prefix" in matchingDeploy[0])) {
      return null;
    }

    return `${matchingDeploy[0].name_prefix}${name}`;
  }
}
