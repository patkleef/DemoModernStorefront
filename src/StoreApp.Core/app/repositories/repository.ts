import { config } from "../config";
import { IRepository } from "./IRepository";

export class Repository implements IRepository {
  private baseTrackingApiUrl: string =
    "https://profilesapi-emea01.profilestore.episerver.net/api/v1.0/";

  /* TRACKING API */
  public async getTrackEvents(): Promise<any> {
    const query =
      "$filter=User.Email eq " +
      config.currentEmailAddress +
      " and EventTime ge " +
      config.currentDate +
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
    const inStoreEvent = "store-visit";
    const query =
      "$filter=EventTime ge " +
      config.currentDate +
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

  public async getProductScannedEvents(): Promise<any> {
    const query =
      "$filter=User.Email eq " +
      config.currentEmailAddress +
      " and EventTime ge " +
      this.getCurrentDateTime() +
      " and EventType eq product-scanned" +
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

  public getCurrentDateTime = () => {
    const now = new Date();
    let today = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );

    console.log(today);
    today = new Date(today.setSeconds(today.getSeconds() - 10));
    console.log(today);
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    const hh = today.getHours();
    const minutes = today.getMinutes();
    const ss = today.getSeconds();

    let result = yyyy.toString() + "-";
    result += (mm < 10 ? "0" + mm : mm) + "-";
    result += (dd < 10 ? "0" + dd : dd) + "T";

    result += (hh < 10 ? "0" + hh : hh) + ":";
    result += (minutes < 10 ? "0" + minutes : minutes) + ":";
    result += ss < 10 ? "0" + ss : ss;

    return result;
  };
}
