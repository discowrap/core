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
    return Object.keys(this._definitionTypes);
  }

  srcPathForType(type: string) {
    return `${this._definitionTypes[type].src.dir}/*.@(${this._definitionTypes[type].src.extension.join("|")})`;
  }

  definitionNameFromSrcPath(definitionPath: string, type: string) {
    const re = new RegExp(`${this._definitionTypes[type].src.dir}/([-a-zA-Z0-9_]+).(?:${this._definitionTypes[type].src.extension.join("|")})`);
    const matches = re.exec(definitionPath);
    if (matches.length < 2) {
      console.log(`No ${this._definitionTypes[type]} matching expression ${re} found in ${definitionPath}`);
    }

    return matches[1];
  }

  installPath(name: string, type: string) {
    return this._definitionTypes[type].install.dir
      + "/"
      + name
      + this._definitionTypes[type].install.extension;
  }

  deployedName(name: string, type: string): string {
    return `${this._definitionTypes[type].deploy.name_prefix}${name}`;
  }
}
