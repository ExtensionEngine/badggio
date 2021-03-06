const STORAGE_KEY = 'APP_USER';
const localStoragePlugin = store => {
  store.subscribe((mutation, store) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.auth.user));
  });
};

export default [localStoragePlugin];
