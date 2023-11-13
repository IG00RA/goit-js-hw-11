declare module 'simplelightbox' {
  interface SimpleLightboxOptions {
    captions?: boolean;
    captionSelector?: string;
  }
  class SimpleLightbox {
    constructor(selector: string, options?: SimpleLightboxOptions);
    readonly options: SimpleLightboxOptions;
    readonly elements: HTMLElement[];
    readonly isOpen: boolean;
    readonly isAnimating: boolean;
    readonly isClosing: boolean;
    readonly isFadeIn: boolean;
    readonly urlChangedOnce: boolean;
    readonly hashReseted: boolean;
    readonly historyHasChanges: boolean;
    open(): void;
    close(): void;

    on(event: string, callback: (event: Event) => void): void;
    off(event: string, callback: (event: Event) => void): void;
  }

  export default SimpleLightbox;
}
