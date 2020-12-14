import {Definition} from "./Definition";

export class DefinitionDescriptor {
  _definitionName: string;
  _definitionPath: string;
  _installPath: string;
  _deployedName: string;
  // _version  TODO
  // _checksum TODO

  constructor(definitionName, definitionPath, installPath, deployedName) {
    this._definitionName = definitionName;
    this._definitionPath = definitionPath;
    this._installPath = installPath;
    this._deployedName = deployedName;
  }

  async getInstance(): Promise<Definition> {
    return import(this.definitionPath())
      .then(definition => definition.default)
      .catch(() => `No default export in ${this.definitionPath()}`);
  }

  definitionName(): string {
    return this._definitionName;
  }

  definitionPath(): string {
    return this._definitionPath;
  }

  installPath(): string {
    return this._installPath;
  }

  deployedName(): string {
    return this._deployedName;
  }

  serialize(): object {
    return {
      definitionName: this._definitionName,
      definitionPath: this._definitionPath,
      installPath: this._installPath,
      deployedName: this._deployedName
    }
  }
}