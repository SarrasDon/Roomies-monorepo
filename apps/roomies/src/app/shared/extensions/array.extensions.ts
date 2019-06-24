interface Array<T> {
  toDictionary(): { [_id: string]: T };
  distinctBy(key: keyof T): Array<T>;
  sortBySpendDate(): Array<T>;
}

Array.prototype.distinctBy = function<T>(this: Array<T>, key: keyof T) {
  const unique = {} as any;
  const distinct: T[] = [];
  this.filter((x: T) => !unique[x[key]]).map((x: T) => {
    if (!unique[x[key]]) {
      distinct.push(x);
      unique[x[key]] = true;
    }
  });
  return distinct;
};

Array.prototype.toDictionary = function<T extends { _id: string }>(
  this: Array<T>
): { [_id: string]: T } {
  return this.reduce((acc, curr) => ({ ...acc, [curr._id]: curr }), {});
};

Array.prototype.sortBySpendDate = function<T extends { spendAt: string }>(
  this: Array<T>
): Array<T> {
  return this.sort((a, b) =>
    new Date(a.spendAt).valueOf() > new Date(b.spendAt).valueOf()
      ? -1
      : new Date(a.spendAt).valueOf() < new Date(b.spendAt).valueOf()
      ? 1
      : 0
  );
};
