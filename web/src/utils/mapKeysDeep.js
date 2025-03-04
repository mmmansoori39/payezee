export function mapKeysDeep(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map((val) => mapKeysDeep(val, fn));
  }
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((acc, current) => {
      const key = fn(current);
      const val = obj[current];
      acc[key] = val !== null && typeof val === "object" ? mapKeysDeep(val, fn) : val;
      return acc;
    }, {});
  }
  return obj;
}
