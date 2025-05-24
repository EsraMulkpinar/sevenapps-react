export function debounce<Args extends string[]>(
    fn: (...args: Args) => void,
    wait: number
  ): (...args: Args) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return function (...args: Args): void {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
  
      timeout = setTimeout(() => {
        fn(...args);
      }, wait);
    };
  }
  