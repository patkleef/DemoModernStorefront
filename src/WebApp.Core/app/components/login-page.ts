/// <amd-dependency path="text!./login-page.html" />
import * as ko from "knockout";
import {firebaseConnection} from "../firebaseConnection";

export class LoginPageViewModel {
    currentComponent = ko.observable().syncWith("currentComponent", true, true);
    loggedInUser = firebaseConnection.loggedInUser;

    constructor() {
    }

    loginClicked = () => {
        this.currentComponent("start-page");
    }

    loginWithGoogleClicked = () => {
        if(this.loggedInUser()){
            this.currentComponent("start-page");
        } else {
            firebaseConnection.loginWithGoogle();
        }
    }

    signupClicked = () => {
        this.currentComponent("signup-page");
    }
}