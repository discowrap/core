import {Project} from "lib/Project";
import {ProjectStructure} from "lib/ProjectStructure";
import {DefinitionDescriptor} from "lib/DefinitionDescriptor";

describe('The Project should', () => {
  const projectWithOneTypeOfDefinition = new Project("rootbeer", new ProjectStructure([
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
    }
  ]), "/tmp/install", "temple");

  const projectWithTwoTypesOfDefinition = new Project("rootbeer", new ProjectStructure([
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
        "extension": ["ts", "js"]
      },
      "install": {
        "dir": "../install/banana",
        "extension": ".json"
      },
      "deploy": {
        "name_prefix": "banana_"
      }
    }
  ]), "stalwart", "temple");


  const oneDefinitionDescriptor = [
    new DefinitionDescriptor(
    "mockDefinition",
    "mockDefPath",
    "mockInsPath",
    "mockDeplName"
    )
  ];

  const twoDefinitionDescriptor = [
    new DefinitionDescriptor(
      "mockDefinition1",
      "mockDefPath1",
      "mockInsPath1",
      "mockDeplName1"
    ),
    new DefinitionDescriptor(
      "mockDefinition2",
      "mockDefPath2",
      "mockInsPath2",
      "mockDeplName2"
    )
  ];

  it('calls deployment sequence once given one definition type', () => {
    const projectUnderTest = projectWithOneTypeOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => oneDefinitionDescriptor);

    const mockDeployDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockDeploy"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'deployDefinition')
      .mockImplementation(mockDeployDefinitionFunction);

    expect.assertions(2);
    return projectUnderTest.deploy("thehost", false).then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(1);
      expect(mockDeployDefinitionFunction).toHaveBeenCalledTimes(1);
    });
  });


  it('calls deployment sequence twice (in the provided order) given two definition types', () => {
    const projectUnderTest = projectWithTwoTypesOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => oneDefinitionDescriptor);

    const mockDeployDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockDeploy"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'deployDefinition')
      .mockImplementation(mockDeployDefinitionFunction);

    expect.assertions(4);
    return projectUnderTest.deploy("thehost", false).then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(2);
      expect(mockDefinitionDescriptorsForTypeFunction.mock.calls[0][0]).toEqual("strawberry");
      expect(mockDefinitionDescriptorsForTypeFunction.mock.calls[1][0]).toEqual("banana");
      expect(mockDeployDefinitionFunction).toHaveBeenCalledTimes(2);
    });
  });


  it('calls deployDefinition twice (in provided order) given one type and two definitions', () => {
    const projectUnderTest = projectWithOneTypeOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => twoDefinitionDescriptor);

    const mockDeployDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockDeploy"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'deployDefinition')
      .mockImplementation(mockDeployDefinitionFunction);

    expect.assertions(4);
    return projectUnderTest.deploy("thehost", false).then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(1);
      expect(mockDeployDefinitionFunction).toHaveBeenCalledTimes(2);
      expect(mockDeployDefinitionFunction.mock.calls[0][1]).toEqual(twoDefinitionDescriptor[0]);
      expect(mockDeployDefinitionFunction.mock.calls[1][1]).toEqual(twoDefinitionDescriptor[1]);
    });
  });


  it('calls deployDefinition four times given two types with two definitions each', () => {
    const projectUnderTest = projectWithTwoTypesOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => twoDefinitionDescriptor);

    const mockDeployDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockDeploy"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'deployDefinition')
      .mockImplementation(mockDeployDefinitionFunction);

    expect.assertions(2);
    return projectUnderTest.deploy("thehost", false).then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(2);
      expect(mockDeployDefinitionFunction).toHaveBeenCalledTimes(4);
    });
  });


  it('calls install sequence once given one definition with one type', () => {
    const projectUnderTest = projectWithOneTypeOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => oneDefinitionDescriptor);

    const mockInstallDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockInstall"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'installDefinition')
      .mockImplementation(mockInstallDefinitionFunction);

    expect.assertions(2);
    return projectUnderTest.install().then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(1);
      expect(mockInstallDefinitionFunction).toHaveBeenCalledTimes(1);
    });
  });

  it('calls install sequence twice given two types with one definition each', () => {
    const projectUnderTest = projectWithTwoTypesOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => oneDefinitionDescriptor);

    const mockInstallDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockInstall"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'installDefinition')
      .mockImplementation(mockInstallDefinitionFunction);

    expect.assertions(2);
    return projectUnderTest.install().then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(2);
      expect(mockInstallDefinitionFunction).toHaveBeenCalledTimes(2);
    });
  });

  it('calls installDefinition twice given two types with two definitions', () => {
    const projectUnderTest = projectWithTwoTypesOfDefinition;
    const mockDefinitionDescriptorsForTypeFunction
      = jest.fn().mockImplementation(() => twoDefinitionDescriptor);

    const mockInstallDefinitionFunction
      = jest.fn().mockImplementation(() => Promise.resolve("mockInstall"));

    jest.spyOn(projectUnderTest, 'definitionDescriptorsFor')
      .mockImplementation(mockDefinitionDescriptorsForTypeFunction);

    jest.spyOn(projectUnderTest, 'installDefinition')
      .mockImplementation(mockInstallDefinitionFunction);

    expect.assertions(2);
    return projectUnderTest.install().then(() => {
      expect(mockDefinitionDescriptorsForTypeFunction).toHaveBeenCalledTimes(2);
      expect(mockInstallDefinitionFunction).toHaveBeenCalledTimes(4);
    });
  });
});