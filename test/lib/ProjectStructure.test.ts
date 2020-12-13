import "jest";
import {ProjectStructure} from "lib/ProjectStructure";

describe('The ProjectStructure should', () => {

  const structure = [
    {
      "type": "strawberry",
      "src": {
        "dir": "strawberry",
        "extension": ["ts", "js"]
      },
      "install": {
        "dir": "../install/strawberry",
        "extension": ".json"
      },
      "deploy": {
        "name_prefix": "strawberry_"
      }
    },
    {
      "type": "banana",
      "src": {
        "dir": "banana",
        "extension": ["ts", "js"],
      },
      "install": {
        "dir": "banana",
        "extension": ".mustache"
      },
      "deploy": {
        "name_prefix": "banana_"
      }
    }
  ];

  it('resolve definition paths', () => {
    const projectStructure = new ProjectStructure(structure);

    expect.assertions(3);
    expect(projectStructure.definitionNameFromSrcPath(
      "strawberry/smoothie.ts",
      "strawberry")
    ).toBe("smoothie");

    expect(projectStructure.definitionNameFromSrcPath(
      "strawberry/sundae.rs",
      "strawberry")
    ).toBeNull();

    expect(projectStructure.definitionNameFromSrcPath(
      "easter/sundae.js",
      "easter")
    ).toBeNull()

  });

  it('resolve srcPathForType', () => {
    const projectStructure = new ProjectStructure(structure);

    expect(projectStructure.srcPathForType(
      "strawberry")
    ).toBe("strawberry/*.@(ts|js)");

    expect(projectStructure.srcPathForType(
      "easter")
    ).toBeNull()
  });

  // resolve install paths
  it('resolve installPath', () => {
    const projectStructure = new ProjectStructure(structure);

    expect(projectStructure.installPath(
      "smoothie",
      "strawberry")
    ).toBe("../install/strawberry/smoothie.json");

    expect(projectStructure.installPath(
      "sundae",
      "easter")
    ).toBeNull();
  });

  // resolve deployedName
  it('resolve deployedName', () => {
    const projectStructure = new ProjectStructure(structure);

    expect(projectStructure.deployedName(
      "smoothie",
      "strawberry")
    ).toBe("strawberry_smoothie");

    expect(projectStructure.deployedName(
      "sundae",
      "easter")
    ).toBeNull();
  });

  // resolve correct order of deployment
  // TODO

});