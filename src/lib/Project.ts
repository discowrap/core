import {resolve} from 'path';
import {glob} from 'glob';
import {ProjectStructure} from "./ProjectStructure";
import {DefinitionDescriptor} from "./DefinitionDescriptor";
import {Installer} from "./actors/Installer";
import {Deployer} from "./actors/Deployer";

/*
 * A Project instance knows where things are in your project and where they should be installed
 * (It represents the "opinionated" conventions of the project – which can be modified using ProjectStructure)
 *
 */

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

  async install(): Promise<Array<string>> {
    return Promise.all(
      this._structure.types()
        .flatMap(
          definitionType => this._installDefinitions(this.definitionDescriptorsFor(definitionType))
        )
    ).then(responses => [].concat(...responses));
  }

  async deploy(searchHost: string, replace: boolean): Promise<Array<string>> {
    return Promise.all(
      this._structure.types()
        .flatMap(
          definitionType => this._deployDefinitions(this.definitionDescriptorsFor(definitionType), searchHost, replace)
        )
    ).then(responses => [].concat(...responses));
  }

  private _installDefinitions(descriptors: Array<DefinitionDescriptor>): Promise<Array<string>> {
    const installer = new Installer();
    return Promise.all(
      descriptors.map(
        descriptor => this.installDefinition(installer, descriptor)
      )
    );
  }

  installDefinition(installer: Installer, descriptor: DefinitionDescriptor): Promise<string> {
    return installer.actOn(descriptor)
      .then(installPath => {
        return `${installPath}: INSTALLED`
      })
      .catch(reason => {
        return `${descriptor.installPath()}: INSTALLATION FAILED (${JSON.stringify(reason)})`
      });
  }

  private _deployDefinitions(descriptors: Array<DefinitionDescriptor>, searchHost: string, replace: boolean = false): Promise<Array<string>> {
    // TODO:  Test to see if any of these exist and halt before deploying (unless replace)
    const deployer = new Deployer(searchHost, replace);
    return Promise.all(
      descriptors.map(
        descriptor => this.deployDefinition(deployer, descriptor)
      )
    );
  }

  deployDefinition(deployer: Deployer, descriptor: DefinitionDescriptor): Promise<string> {
    return deployer.actOn(descriptor)
      .then(() => {
        return `${descriptor.deployedName()}: DEPLOYED`
      })
      .catch(reason => {
        return `${descriptor.deployedName()}: DEPLOYMENT FAILED (${JSON.stringify(reason)})`
      });
  }

  definitionDescriptorsFor(type: string): Array<DefinitionDescriptor> {
    const normalizedPath = resolve(this._templateRoot, this._structure.srcPathForType(type));
    const installDir = this._installDir;
    const structure = this._structure;

    return glob.sync(normalizedPath).map(definitionPath => {
      const definitionName = structure.definitionNameFromSrcPath(definitionPath, type);
      const installPath = resolve(installDir, structure.installPath(definitionName, type));
      const deployedName = structure.deployedName(definitionName, type);

      return new DefinitionDescriptor(definitionName, definitionPath, installPath, deployedName)
    });
  }

}




