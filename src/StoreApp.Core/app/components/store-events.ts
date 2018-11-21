/// <amd-dependency path="text!./store-events.html" />
import * as $ from "jquery";
import * as ko from "knockout";

export class StoreEventsViewModel {
  eventsArray: KnockoutObservableArray<Models.UserEvent>;
  user: KnockoutObservable<firebase.User>;

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    this.eventsArray = null;
    this.user = null;
  }
}
