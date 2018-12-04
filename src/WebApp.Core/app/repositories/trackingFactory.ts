import { config } from "./../config";
import { TrackingStub } from "./trackingStub";
import { TrackingRepository } from "./trackingRepository";
import { ITrackingRepository } from "./ITrackingRepository";

export const trackingFactory = {
  get(): ITrackingRepository {
    return config.useTrackingStub
      ? new TrackingStub()
      : new TrackingRepository();
  }
};
