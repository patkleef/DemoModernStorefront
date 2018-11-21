/// <amd-dependency path="text!./active-users.html" />
import * as firebase from "firebase";
import * as $ from "jquery";
import * as ko from "knockout";

export class ActiveUsersViewModel {
  activeUsersArray: KnockoutObservableArray<Models.ActiveUser>;
  user: KnockoutObservable<firebase.User>;

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    this.activeUsersArray = null;
    this.user = null;
  }
}
