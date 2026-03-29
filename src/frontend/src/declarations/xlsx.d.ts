declare module 'xlsx' {
  interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  type WorkSheet = Record<string, unknown>;
  interface ReadOpts {
    type?: 'array' | 'binary' | 'buffer' | 'base64' | 'string';
  }
  const utils: {
    sheet_to_json<T = Record<string, unknown>>(sheet: WorkSheet): T[];
  };
  function read(data: unknown, opts?: ReadOpts): WorkBook;
}
