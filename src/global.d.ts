declare module NodeJS {
  interface Global {
    /** socket */
    io: any;
    /** kue queue */
    queue: any;
    /** open/close trade */
    openTrade: any;
  }
}
