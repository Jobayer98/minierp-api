export class ApiResponse<T = unknown> {
  success = true;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;

  constructor(message: string, data?: T, meta?: Record<string, unknown>) {
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }
}
