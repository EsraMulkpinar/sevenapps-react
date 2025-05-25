export interface DebouncedFunction<T extends (...args: never[]) => void | Promise<void>> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function debounce<T extends (...args: never[]) => void | Promise<void>>(
  fn: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = function (...args: Parameters<T>): void {
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

  return debouncedFn as DebouncedFunction<T>;
}

export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  
  return function (...args: Parameters<T>): void {
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
  