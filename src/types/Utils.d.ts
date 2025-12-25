type AtLeastOne<T> = {
  [K in keyof T]-?: Pick<T, K> & Partial<T>;
}[keyof T];

type VoidFn = () => void;
