import {DefinitionDescriptor} from "../DefinitionDescriptor";
import {EngineResponse} from "../EngineResponse";
import {DescriptorActor} from "./DescriptorActor";

export class Deployer implements DescriptorActor {
  _searchHost: string;
  _replace: boolean;

  constructor(searchHost: string,
              replace: boolean=false) {
    this._searchHost = searchHost;
    this._replace = replace;
  }

  actOn(descriptor: DefinitionDescriptor): Promise<EngineResponse> {
    return descriptor.getInstance()
      .then(instance => instance.deploy(this._searchHost, instance.name(), this._replace));
  }

  // TODO: Write definition name into manifest/lockfile for easier reference.
  // TODO:  Along with deployment state, date, host?  Gah!  There's got to be something
  //  to piggyback on for this (node packages?)
}