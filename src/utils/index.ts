export interface DebouncedFunction<Args extends any[]> {
  (...args: Args): void;
  cancel(): void;
}

export function debounce<Args extends any[]>(
  fn: (...args: Args) => void | Promise<void>,
  wait: number
): DebouncedFunction<Args> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = function (...args: Args): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };

  debouncedFn.cancel = function (): void {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFn;
}

export function throttle<Args extends any[]>(
  fn: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let lastTime = 0;
  
  return function (...args: Args): void {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  };
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
  