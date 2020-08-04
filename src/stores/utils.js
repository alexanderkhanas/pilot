import { types as t, getParent, getRoot } from 'mobx-state-tree';

//tupo fabrica
export function asyncModel(thunk, auto = true) {
  const model = t
    .model(thunk.name, {
      isLoading: false,
      isError: false,
    })
    .actions((self) => ({
      start() {
        self.isLoading = true;
        self.isError = false;
      },
      success() {
        self.isLoading = false;
      },
      error(e) {
        console.error(`Error in async model(${thunk.name})`, e);
        self.isLoading = false;
        self.isError = true;
      },
      async _auto(promise) {
        try {
          self.start();

          const res = await promise;

          self.success();

          return res;
        } catch (e) {
          self.error(e);
        }
      },
      async run(...args) {
        const promise = thunk(...args)(self, getParent(self), getRoot(self));

        if (auto) {
          return self._auto(promise);
        }

        return promise;
      },
    }));

  return t.optional(model, {});
}
