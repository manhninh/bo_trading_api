declare module NodeJS {
  interface Global {
    /** socket */
    ioCalculator: any;
    /** kue queue */
    queue: any;
    /** open/close trade */
    openTrade: any;
  }
}
