// Superclass of QueryTemplateDefinition, IndexTemplateDefinition, FeaturesetTemplateDefinition

// Install
// 1. Load
// 2. Transform
// 3. Install

// Deploy
// 1. Load
// 2. Transform
// 3. Deploy


import {outputFile} from "fs-extra";
import {EngineResponse} from "./EngineResponse";
import {Installable} from "./behaviors/Installable";

export abstract class Definition implements Installable {
  _name: string;

  constructor(name) {
    this._name = name;
  }

  name(): string {
    return this._name;
  }

  /**
   * Installs the "transformed" serialization of the definition to the desired path.
   * @param path
   */
  install(path: string): Promise<string> {
    return this.transform(false)
      .then(transformed => outputFile(path, transformed))
      .then(() => path)
      .catch(err => Promise.reject(err));
  }

  /**
   * Subclass should externalize the definition in the required format for the definition type.
   * @param compress
   */
  abstract transform(compress: boolean): Promise<string>;

  /**
   * Subclass should deploy the "transformed" definition to the appropriate sink with the appropriate id
   * @param searchHost
   * @param name - The name of the definition to be deployed
   * @param replace - Overwrite definitions found in cluster if true.
   */
  abstract deploy(searchHost: string, name?: string, replace?: boolean): Promise<EngineResponse>;

  /**
   * Verify that the definition is deployed
   * @param searchHost
   * @param name - The name of the definition to be deployed
   */
  abstract isDeployed(searchHost: string, name?: string): Promise<EngineResponse>;

  /**
   * Final subclass will build their template/definition inside this method
   */
  abstract definition(): Object;
}