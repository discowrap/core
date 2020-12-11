import {EngineResponse} from "./EngineResponse";

export interface Engine {
  _node: string,

  healthy(): Promise<EngineResponse>;

  /*
  deployIndex(indexName: string, definition: Index): Promise<EngineResponse>;

  indexIsDeployed(indexName: string): Promise<EngineResponse>;

  loadDocuments(indexName: string, documents: { [key: string]: object }): Promise<EngineResponse>;

  deleteIndex(indexName: string, ignoreMissing: boolean): Promise<EngineResponse>;
  */
  // Need not generify
  //search(indexName: string, query: Query, parameters: { [key: string]: any }): Promise<EngineResponse>;
}


// Engines need to support a prescribed list of actions, and execute()
// them in the same sequence every time
//
// Actions of the same time need to be idempotent
// E.g.  addIndexTemplate (should leave the cluster in the same state after
// any number of invocations)
// E.g. indexDocuments (when run multiple times should leave the index with
// the same number of documents after running it once)
//

// Engine exposes the rest of the API