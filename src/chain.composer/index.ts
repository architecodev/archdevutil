export const chainComposer = (...chain: any[]) => {
  for (const c of chain) {
    if (typeof c !== "function") {
      throw new TypeError("Chain must be composed of functions");
    }
  }

  return (...args: any[]) => {
    let invokeIndex = -1;
    const lastArg = args.length ? args[args.length - 1] : undefined;
    const lastCallback = typeof lastArg === "function" ? lastArg : undefined;

    const invoke = (index: number) => {
      if (invokeIndex < index) {
        invokeIndex = index;
      } else {
        throw new Error("Function Error: next() called multiple times");
      }

      const targetFunction: Function = index === chain.length ? lastCallback : chain[index];

      if (targetFunction == undefined) {
        return Promise.resolve();
      } else {
        try {
          const fnArgs = lastCallback ? [...args.slice(0, args.length - 1), () => invoke(index + 1)] : [...args, () => invoke(index + 1)];
          return Promise.resolve(targetFunction.apply(undefined, fnArgs));
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };

    return invoke(0);
  };
};
