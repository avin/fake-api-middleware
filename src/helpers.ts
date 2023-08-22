export const delay = (time: number): Promise<void> => {
  return new Promise((r) => {
    setTimeout(r, time);
  });
};

export const isString = (value: any): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
};
