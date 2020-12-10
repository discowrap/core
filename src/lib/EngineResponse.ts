import {SearchResults} from "./SearchResults";

export abstract class EngineResponse {
  success: boolean;
  statusCode: number;
  message: string;
  body: object;

  constructor({ success, statusCode, message, body }) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.body = body;
  }

  abstract results(): SearchResults;
}

export const successful = (statusCode) => (statusCode >= 200 && statusCode < 300);