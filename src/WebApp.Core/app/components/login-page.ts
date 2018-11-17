/// <amd-dependency path="text!./login-page.html" />
import * as ko from "knockout";
import { firebaseConnection } from "../firebaseConnection";
import { Repository } from "../repository";

export class LoginPageViewModel {
  currentComponent = ko.observable().syncWith("currentComponent", true, true);
  currentCustomer = ko.observable().syncWith("currentCustomer", true, true);
  loggedInUser = firebaseConnection.loggedInUser;
  repository = new Repository();

  constructor() {}

  loginClicked = () => {
    const response = this.repository.getCurrentCustomer(
      "79199f0b-8cab-4c5f-9b26-007825d5c32d"
    );

    response.then(data => {
      this.currentCustomer(data);

      this.currentComponent("start-page");
    });
  };

  loginWithGoogleClicked = () => {
    if (this.loggedInUser()) {
      this.currentComponent("start-page");
    } else {
      firebaseConnection.loginWithGoogle();
    }
  };

  signupClicked = () => {
    this.currentComponent("signup-page");
  };
}
