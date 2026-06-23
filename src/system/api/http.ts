const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

interface RequestOptions {
  headers?: HeadersInit;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function readErrorPayload(response: Response) {
  const fallback = 'Request failed.';
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        detail?: string;
        code?: string;
      };

      return {
        message:
          payload.message?.trim() ||
          payload.error?.trim() ||
          payload.detail?.trim() ||
          fallback,
        code: payload.code?.trim() || undefined,
      };
    }

    const text = (await response.text()).trim();
    return {
      message: text || fallback,
      code: undefined,
    };
  } catch {
    return {
      message: fallback,
      code: undefined,
    };
  }
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.headers,
  });

  if (!response.ok) {
    const errorPayload = await readErrorPayload(response);
    throw new ApiError(
      response.status,
      errorPayload.message,
      errorPayload.code,
    );
  }

  return (await response.json()) as T;
}

export async function sendJson<T>(
  path: string,
  method: 'POST',
  body: unknown,
  options: RequestOptions = {},
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await readErrorPayload(response);
    throw new ApiError(
      response.status,
      errorPayload.message,
      errorPayload.code,
    );
  }

  return (await response.json()) as T;
}

export function mapEnvelope<TIn, TOut, TEnvelope extends { items: TIn[] }>(
  envelope: TEnvelope,
  mapper: (item: TIn) => TOut,
): Omit<TEnvelope, 'items'> & { items: TOut[] } {
  return {
    ...envelope,
    items: envelope.items.map(mapper),
  };
}
