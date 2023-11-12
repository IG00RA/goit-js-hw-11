declare module 'notiflix/build/notiflix-notify-aio' {
  export interface Notify {
    success(message: string, options?: { [key: string]: any }): void;
    failure(message: string, options?: { [key: string]: any }): void;
    info(message: string, options?: { [key: string]: any }): void;
    warning(message: string, options?: { [key: string]: any }): void;
  }

  const Notify: Notify;
  export default Notify;
}
