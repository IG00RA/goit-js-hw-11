declare module 'debounce' {
  type DebouncedFunction<T extends (...args: any[]) => any> = (
    ...args: Parameters<T>
  ) => void;

  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): DebouncedFunction<T>;
}
