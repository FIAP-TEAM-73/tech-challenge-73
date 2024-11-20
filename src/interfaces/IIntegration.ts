export interface IIntegration {
  post: (endpoint: string, body: unknown, configs: Record<string, any>) => Promise<unknown>
  put: (endpoint: string, body: unknown, configs: Record<string, any>) => Promise<unknown>
  get: (endpoint: string, configs: Record<string, any>) => Promise<unknown>
}
