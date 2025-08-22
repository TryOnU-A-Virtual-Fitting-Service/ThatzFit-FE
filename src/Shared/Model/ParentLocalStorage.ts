export const parentLocalStorage = {
  getItem: (key: string) => {
    return window.parent.localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    window.parent.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    window.parent.localStorage.removeItem(key);
  },
};
