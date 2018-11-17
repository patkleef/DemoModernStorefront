/// <amd-dependency path="text!./store-events.html" />
import * as firebase from "firebase";
import {firebaseConnection} from "../firebaseConnection";
import {firebaseActiveUsers} from "../firebaseActiveUsers";
import * as $ from "jquery";
import * as ko from "knockout";

export class StoreEventsViewModel {
    eventsArray:KnockoutObservableArray<Models.UserEvent>;
    user: KnockoutObservable<firebase.User>;
    
    clickLogin = () => {
        firebaseConnection.loginWithGoogle();
    }

    clickTest = () => {
        firebaseActiveUsers.clickTest();
    }

    constructor() {
        this.eventsArray = firebaseActiveUsers.eventsArray;
        this.user = firebaseConnection.loggedInUser;
    }
}