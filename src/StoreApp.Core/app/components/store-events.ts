/// <amd-dependency path="text!./store-events.html" />
import * as ko from "knockout";
import { repositoryFactory } from "../repositories/repositoryFactory";

export class StoreEventsViewModel {
  eventsArray = ko.observableArray<any>([]);
  user: KnockoutObservable<Models.TrackEvent>;
  repository = repositoryFactory.get();

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
