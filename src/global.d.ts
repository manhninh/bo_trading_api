declare module NodeJS {
  interface Global {
    /** kue queue */
    queue: any;
    /** open/close trade */
    openTrade: any;
  }
}
