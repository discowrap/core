import {DefinitionDescriptor} from "../DefinitionDescriptor";
import {DescriptorActor} from "../actors/DescriptorActor";

export class Installer implements DescriptorActor {
  constructor() {
  }

  actOn(descriptor: DefinitionDescriptor): Promise<string> {
    return descriptor.getInstance()
      .then(instance => instance.install(descriptor.installPath()))
      .then(path => path);
  }
}