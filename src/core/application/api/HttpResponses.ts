export interface HttpResponse { statusCode: number, payload: unknown }

export const noContent = (): HttpResponse => {
  return {
    statusCode: 204,
    payload: undefined
  }
}

export const ok = (payload: unknown): HttpResponse => {
  return {
    statusCode: 200,
    payload
  }
}

export const internalServerError = (message: string, error: unknown = new Error('Unknown failure!')): HttpResponse => {
  return {
    statusCode: 500,
    payload: {
      friendlyMessage: message,
      errorMessage: error instanceof Error ? error.message : 'Unknown failure!'
    }
  }
}

export const notFoundError = (message: string, error: unknown = new Error('Resource not found!')): HttpResponse => {
  return {
    statusCode: 404,
    payload: {
      friendlyMessage: message,
      errorMessage: error instanceof Error ? error.message : 'Resource not found!'
    }
  }
}
