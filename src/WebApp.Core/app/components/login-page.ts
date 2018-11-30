/// <amd-dependency path="text!./login-page.html" />
import * as ko from "knockout";
import { EventTypes } from "../models/EventTypes";
import { repositoryFactory } from "../repositories/repositoryFactory";
import { config } from "../config";

export class LoginPageViewModel {
  currentComponent = ko.observable().syncWith("currentComponent", true, true);
  currentCustomer = ko.observable().syncWith("currentCustomer", true, true);
  repository = repositoryFactory.get();

  constructor() {}

  loginClicked = () => {
    const response = this.repository.getCurrentCustomer(config.customerId);

    response.then(data => {
      this.currentCustomer(data);

      this.repository.trackEvent(data, EventTypes.userLogin);

      this.currentComponent("start-page");
    });
  };

  loginWithGoogleClicked = () => {
    /*if (this.loggedInUser()) {
      this.currentComponent("start-page");
    } else {
      // firebaseConnection.loginWithGoogle();
    }*/
  };

  signupClicked = () => {
    this.currentComponent("signup-page");
  };
}
