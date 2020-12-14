import {DefinitionDescriptor} from "../DefinitionDescriptor";
import {EngineResponse} from "../EngineResponse";

export interface Deployable {
  deploy(descriptor: DefinitionDescriptor,
         searchHost: string,
         replace: boolean): Promise<EngineResponse>;


  isDeployed(searchHost: string,
             name: string): Promise<EngineResponse>
}