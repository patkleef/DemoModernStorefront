export interface ITrackingRepository {
  trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string,
    data?: any
  ): Promise<any>;
  getNumberOfVisitsThisMonth(
    contact: Models.Contact,
    store: Models.Store
  ): Promise<any>;
}
