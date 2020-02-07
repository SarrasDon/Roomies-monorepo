export function toDictionary<T extends { _id: string }>(
  array: Array<T>
): { [_id: string]: T } {
  return array.reduce((acc, curr) => ({ ...acc, [curr._id]: curr }), {});
}
