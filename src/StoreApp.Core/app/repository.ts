import { config } from "./config";

export class Repository {
  private baseTrackingApiUrl: string =
    "https://profilesapi-emea01.profilestore.episerver.net/api/v1.0/";

  /* TRACKING API */
  public async getTrackEvents(): Promise<any> {
    const query =
      "$filter=User.Email eq " +
      config.currentEmailAddress +
      " and EventTime ge " +
      config.currentDateTime +
      "&$orderBy=EventTime DESC";
    const response = await fetch(
      this.baseTrackingApiUrl + "TrackEvents?" + encodeURI(query),
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
          Authorization: "epi-single " + config.profileStoreKey
        }
      }
    );
    return response.json();
  }

  public async getActiveUsers(): Promise<any> {
    const inStoreEvent = "page-view";
    const query =
      "$filter=EventTime ge " +
      config.currentDateTime +
      " and EventType eq " +
      inStoreEvent +
      "&$orderBy=EventTime DESC";
    const response = await fetch(
      this.baseTrackingApiUrl + "TrackEvents?" + encodeURI(query),
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
          Authorization: "epi-single " + config.profileStoreKey
        }
      }
    );
    return response.json();
  }
}
