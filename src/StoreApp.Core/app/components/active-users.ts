/// <amd-dependency path="text!./active-users.html" />
import * as firebase from "firebase";
import {firebaseConnection} from "../firebaseConnection";
import {firebaseActiveUsers} from "../firebaseActiveUsers";
import * as $ from "jquery";
import * as ko from "knockout";

export class ActiveUsersViewModel {
    activeUsersArray:KnockoutObservableArray<Models.ActiveUser>;
    user: KnockoutObservable<firebase.User>;
    
    clickLogin = () => {
        firebaseConnection.loginWithGoogle();
    }

    clickTest = () => {
        firebaseActiveUsers.clickTest();
    }

    constructor() {
        this.activeUsersArray = firebaseActiveUsers.activeUsersArray;
        this.user = firebaseConnection.loggedInUser;
    }    
}