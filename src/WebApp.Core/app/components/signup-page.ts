/// <amd-dependency path="text!./signup-page.html" />
import * as ko from "knockout";
export class SignupPageViewModel {
    currentComponent = ko.observable().syncWith("currentComponent", true, true);

    constructor() {
    }

    loginClicked = () => {
        this.currentComponent("login-page");
    }

    signupClicked = () => {
        this.currentComponent("login-page");
    }
}
