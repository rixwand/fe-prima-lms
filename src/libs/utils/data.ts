type DiffOptions<T, K extends keyof T, P extends keyof T> = {
  key?: K;
  props: P[];
};

export function diffList<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends keyof T = "id",
  P extends keyof T = keyof T
>(base: T[], changed: T[], options: DiffOptions<T, K, P>): Array<Pick<T, K | P>> {
  const key = options.key ?? ("id" as K);
  const props = options.props;

  const baseMap = new Map(base.map(item => [item[key], item]));
  const changedMap = new Map(changed.map(item => [item[key], item]));

  const diffs: Array<Pick<T, K | P>> = [];

  for (const [id, changedItem] of changedMap.entries()) {
    const baseItem = baseMap.get(id);
    if (!baseItem) continue;

    // Build an object containing the key and changed props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diff: any = { [key]: id };
    let hasChange = false;

    for (const prop of props) {
      if (baseItem[prop] !== changedItem[prop]) {
        diff[prop] = changedItem[prop];
        hasChange = true;
      }
    }

    if (hasChange) diffs.push(diff);
  }

  return diffs;
}
