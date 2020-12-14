export interface Installable {
  install(path: string): Promise<string>
}