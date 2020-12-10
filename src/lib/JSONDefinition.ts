import {Definition} from "./Definition";

export abstract class JSONDefinition extends Definition {
  _definition: string;

  protected constructor(name, definition) {
    super(name);
    this._definition = definition;
  }

  definition() {
    return this._definition; // the template
  }

  /**
   * Externalizes the internal object representation of the template into valid JSON
   * @param compress
   */
  transform(compress: boolean = false) {
    const transformed = this.definition();
    return Promise.resolve((compress) ? toJSON(transformed, true) : toJSON(transformed))
  };

}


const toJSON = (object, compress = false) => {
  return JSON.stringify(object, null, (compress) ? 0 : 2)
};
