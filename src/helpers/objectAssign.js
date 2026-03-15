export function ObjectAssing(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      target[key] = target[key] || {};
      ObjectAssing(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
