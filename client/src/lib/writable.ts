import type {Writable} from 'svelte/store';

export async function writableToPromise<T = any>(store: Writable<T>, ignoreValues = [undefined]): Promise<T> {
  return new Promise((resolve) => {
    store.subscribe((value) => {
      if (!ignoreValues.includes(value)) {
        resolve(value);
      }
    });
  });
}
