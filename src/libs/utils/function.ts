export const voidFn = () => {};
export const aVoidFn = async () => {};

export const waitForLoading = async (fn: () => unknown, loading: boolean) =>
  new Promise<void>(async resolve => {
    fn();
    const interval = setInterval(() => {
      if (!loading) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
