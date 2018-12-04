import * as ko from "knockout";
import { config } from "./../config";
import { ITrackingRepository } from "./ITrackingRepository";
import { EventTypes } from "../models/EventTypes";

export class TrackingRepository implements ITrackingRepository {
  private baseTrackingApiUrl: string =
    "https://track-emea01.profilestore.episerver.net/api/v1.0/";
  private baseProfileApiUrl: string =
    "https://profilesapi-emea01.profilestore.episerver.net/api/v1.0/";

  /* TRACKING API */
  public async trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string,
    data?: any
  ): Promise<any> {
    const trackId =
      eventType === EventTypes.storeVisit
        ? EventTypes.storeVisit.toString() +
          "|" +
          this.getCurrentDateFormatted()
        : this.guid();

    const request = {
      user: {
        name: contact.firstName + " " + contact.lastName,
        email: contact.email
      },
      payload: data,
      remoteAddress: "127.0.0.1",
      clientId: contact.primaryKeyId,
      deviceId: config.trackingDeviceId,
      eventType: eventType,
      value: value !== undefined ? value : eventType,
      trackId: trackId, //event uniqueness
      scope: config.trackingScope,
      eventTime: new Date().toISOString()
    };
    const response = await fetch(this.baseTrackingApiUrl + "Track", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        Authorization: "epi-single " + config.trackApiKey
      },
      body: JSON.stringify(request)
    });
    return response;
  }

  public async getNumberOfVisitsThisMonth(
    contact: Models.Contact,
    store: Models.Store
  ): Promise<any> {
    const query =
      "$filter=User.Email eq " +
      contact.email +
      " and EventTime ge " +
      config.startCountingVisitsDate +
      " and EventType eq " +
      EventTypes.storeVisit +
      " and Payload.code eq " +
      store.code +
      "&$orderBy=EventTime DESC";
    const response = await fetch(
      this.baseProfileApiUrl + "TrackEvents?" + encodeURI(query),
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

  public guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  public getCurrentDateFormatted() {
    const d = new Date();
    Date.now;

    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();
  }
}
