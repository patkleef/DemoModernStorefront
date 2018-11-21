/// <amd-dependency path="text!./store-events.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { Repository } from "../repository";

export class StoreEventsViewModel {
  eventsArray = ko.observableArray<any>([]);
  user: KnockoutObservable<Models.TrackEvent>;
  repository = new Repository();

  currentUserEmailAddress = ko
    .observable<Models.Product>()
    .syncWith("currentUserEmailAddress", true, true);

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    const events = this.repository.getTrackEvents();

    events.then((events: any) => {
      events.items.forEach((event: Models.TrackEvent) => {
        this.eventsArray.push(event);
      });
    });

    this.user = null;
  }
}
