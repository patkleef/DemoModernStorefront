/// <amd-dependency path="text!./active-users.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { Repository } from "../repository";

export class ActiveUsersViewModel {
  activeUsersArray = ko.observableArray<any>([]);
  user: KnockoutObservable<firebase.User>;
  repository = new Repository();

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    const events = this.repository.getActiveUsers();

    events.then((events: any) => {
      events.items.forEach((event: Models.TrackEvent) => {
        if (
          this.activeUsersArray().find(x => x.Email === event.User.Email) ===
          undefined
        ) {
          this.activeUsersArray.push(event.User);
        }
      });
    });

    this.user = null;
  }
}
