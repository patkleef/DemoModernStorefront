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
    this.checkForNewEvents();

    this.user = null;
  }

  checkForNewEvents = () => {
    const eventsPromise = this.repository.getTrackEvents();
    this.eventsArray.removeAll();
    eventsPromise.then((events: any) => {
      events.items.forEach((event: Models.TrackEvent) => {
        this.eventsArray.push(event);
      });
    }).then(() => {
      setTimeout(this.checkForNewEvents, 10000);
    });
  }
}
