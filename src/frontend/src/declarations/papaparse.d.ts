declare module 'papaparse' {
  interface ParseResult<T> {
    data: T[];
    errors: Array<{ message: string; row: number }>;
    meta: { fields?: string[] };
  }
  interface ParseConfig<T> {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete?: (results: ParseResult<T>) => void;
    error?: (error: Error) => void;
  }
  function parse<T = Record<string, string>>(input: string | File, config?: ParseConfig<T>): ParseResult<T>;
  const _default: { parse: typeof parse };
  export default _default;
}
