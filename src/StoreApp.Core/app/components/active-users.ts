/// <amd-dependency path="text!./active-users.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { repositoryFactory } from "../repositories/repositoryFactory";

export class ActiveUsersViewModel {
  activeUsersArray = ko.observableArray<any>([]);
  user: KnockoutObservable<firebase.User>;
  repository = repositoryFactory.get();

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    this.checkForNewEvents();

    this.user = null;
  }

  checkForNewEvents = () => {
    const eventsPromise = this.repository.getActiveUsers();
    this.activeUsersArray.removeAll();

    eventsPromise.then((events: any) => {
      events.items.forEach((event: Models.TrackEvent) => {
        if (
          this.activeUsersArray().find(x => x.Email === event.User.Email) ===
          undefined
        ) {
          this.activeUsersArray.push(event.User);
        }
      });
    }).then(() => {
      setTimeout(this.checkForNewEvents, 10000);
    });
  }
}
