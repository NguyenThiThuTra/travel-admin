export function searchParams(locationSearch) {
  const value = new Proxy(new URLSearchParams(locationSearch), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return value;
}
