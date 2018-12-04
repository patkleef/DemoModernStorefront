import { ITrackingRepository } from "./ITrackingRepository";

export class TrackingStub implements ITrackingRepository {
  public async trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string,
    data?: any
  ): Promise<any> {
    console.log(
      "Track event " +
        eventType +
        " - " +
        value +
        " for customer " +
        contact.email
    );
  }
  public async getNumberOfVisitsThisMonth(
    contact: Models.Contact,
    store: Models.Store
  ): Promise<any> {
    return new Promise(function(resolve, reject) {
      resolve(4);
    });
  }
}
