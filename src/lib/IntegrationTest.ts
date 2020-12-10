import { v4 as uuidv4 } from "uuid";
import {EngineResponse} from "./EngineResponse";

export abstract class IntegrationTest {
  protected readonly _testIndexName: string;

  protected constructor() {
    this._testIndexName = `test_index_${uuidv4()}`;
  }

  async abstract setup(): Promise<this>;

  async abstract search(parameters: { [key: string]: any }, verbose: true): Promise<EngineResponse>;

  async abstract teardown(): Promise<EngineResponse>;

  async run(func: { (IntegrationTest): Promise<any> }) {
    return this.setup()
      .then(() => func(this))
      .finally(() => this.teardown());
  }

  async runAll(funcs: Array<{ (IntegrationTest): Promise<any> }>) {
    return this.setup()
      .then(() => {
        const promises = funcs.map(f => f(this));
        return Promise.all(promises)
      })
      .finally(() => this.teardown());
  }
}
