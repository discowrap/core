import {resolve} from 'path';
import {glob} from 'glob';
import {Definition} from "./Definition";
import {ProjectStructure} from "./ProjectStructure";

/*
 * A Project instance knows where things are in your project and where they should be installed
 * (It represents the "opinionated" conventions)
 *
 * Project owns the "install" target.  It delegates the exact install implementation to the asset class.
 * However, it places "install"ed files according to the ProjectStructure.
 */


type DefinitionPath = {
  definition: string,
  install: string,
  deployedName: string
}

type DefinitionPaths = {
  [key:string]: DefinitionPath
}

export class Project {
  _projectRoot: string;
  _installDir: string;
  _templateRoot: string;
  _structure: ProjectStructure;

  constructor(projectRoot: string,
                        structure: ProjectStructure,
                        installDir?: string,
                        templateRoot?: string) {
    this._projectRoot = projectRoot;
    this._structure = structure;
    this._installDir = (installDir !== undefined) ? installDir : resolve(projectRoot, 'install');
    this._templateRoot = (templateRoot !== undefined) ? templateRoot : projectRoot;
  }

  install() {
    const allThePromises = this._structure.types()
      .reduce((proms, definitionType) => [
        ...proms,
        ...this._installDefinitions(this.projectMappingFor(definitionType))
      ],[]);

    return Promise.all(allThePromises);
  }

  deploy(searchHost: string, replace: boolean) {
    const allThePromises = this._structure.types()
      .reduce((proms, definitionType) => [
        ...proms,
        ...this._deployDefinitions(this.projectMappingFor(definitionType), searchHost, replace)
      ],[]);

    return Promise.all(allThePromises);
  }

  _installDefinitions(definitionPaths: DefinitionPaths): Array<Promise<string>> {
    return Object.keys(definitionPaths).reduce((acc, name) => {
      const definitionPath = definitionPaths[name].definition;
      const installPath = definitionPaths[name].install;
      return [...acc, this._getInstance(definitionPath)
        .then(instance => instance.install(installPath))
        .then(() => {
          return `${installPath}: INSTALLED`
        })
        .catch(reason => {
          return `${installPath}: INSTALLATION FAILED (${reason})`
        })
      ];
    }, []);
  }

  _deployDefinitions(definitionPaths: DefinitionPaths, searchHost: string, replace: boolean = false): Array<Promise<string>> {
    // TODO:  Test to see if any of these exist and halt before deploying (unless replace)
    return Object.keys(definitionPaths).reduce((acc, name) => {
      const definitionPath = definitionPaths[name].definition;
      return [...acc, this._getInstance(definitionPath)
        .then(instance => instance.deploy(searchHost, instance.name(), replace))
        .then(() => {
          return `${name}: DEPLOYED`
        })
        .catch(reason => {
          return `${name}: DEPLOYMENT FAILED (${JSON.stringify(reason)})`
        })
      ];
    }, []);
  }

  // if "replace" - trigger rollAliases

  async _getInstance(definitionPath: string): Promise<Definition> {
    const definition = await import(definitionPath);
    return definition.default;
  }

  projectMappingFor(type: string): DefinitionPaths {
    const normalizedPath = resolve(this._templateRoot, this._structure.srcPathForType(type));
    const installDir = this._installDir;
    const structure = this._structure;

    return glob.sync(normalizedPath)
      .reduce((acc, definitionSrcFile) => {
        const definitionName = structure.definitionNameFromSrcPath(definitionSrcFile, type);
        acc[definitionName] = {
          definition: definitionSrcFile,
          install: resolve(installDir, structure.installPath(definitionName, type)),
          deployedName: structure.deployedName(definitionName, type)
        };
        return acc;
      }, {});
  };
}




