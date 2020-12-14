import {DefinitionDescriptor} from "../DefinitionDescriptor";

export interface DescriptorActor {
  actOn(descriptor: DefinitionDescriptor): Promise<any>; // TODO: Standardized response
}