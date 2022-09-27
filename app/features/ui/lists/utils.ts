function extractSearchParamsAsInteger(
  searchParams: URLSearchParams,
  name: string,
  defaultValue = 0
) {
  const param = Number(searchParams.get(name) || defaultValue);
  return !Number.isSafeInteger(param) || param < 0 ? 0 : param;
}

export function parsePaginatedSearchParams(searchParams: URLSearchParams) {
  return {
    limit: extractSearchParamsAsInteger(searchParams, "limit", 50),
    offset: extractSearchParamsAsInteger(searchParams, "offset", 0),
  };
}
