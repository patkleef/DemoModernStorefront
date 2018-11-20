export class Repository {
  private baseTrackingApiUrl: string =
    "https://track-emea01.profilestore.episerver.net//api/v1.0/";

  /* TRACKING API */
  public async getTrackEvents(
    contact: Models.Contact,
    eventType: string,
    date: Date
  ): Promise<any> {
    const query =
      "filter=User.Email eq goldie.hawkins@example.com and EventTime ge 2018-11-19&orderBy=EventTime DESC";
    const response = await fetch(this.baseTrackingApiUrl + "Track?" + query, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        Authorization: "epi-single KEY"
      }
    });
    return response;
  }
}
