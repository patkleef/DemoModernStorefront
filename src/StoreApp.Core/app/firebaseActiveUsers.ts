import * as firebase from "firebase";
import * as $ from "jquery";
import * as ko from "knockout";
import {firebaseConnection} from "firebaseConnection";

export module firebaseActiveUsers {
    export var activeUsersArray = ko.observableArray<Models.ActiveUser>();
    
    export var eventsArray = ko.observableArray<Models.UserEvent>();
    
    
    export function clickTest(){
        const userInfo = getUserInfo(firebaseConnection.loggedInUser());

        firebaseConnection.app.database().ref('active-users/' + userInfo.displayName).set({
            userInfo: userInfo,
            lastActive: new Date().getTime()
        });
    }
    
    const activeUsersRef = firebaseConnection.app.database().ref('active-users').limitToLast(100);
    activeUsersRef.on('child_added', (data) => {
        var activeUser = data.val() as Models.ActiveUser;
        activeUsersArray.unshift(activeUser);
    });

    activeUsersRef.on('child_changed', (data) => {
        var activeUser = data.val() as Models.ActiveUser;
        activeUsersArray.remove((user) => { return user.userInfo.uid === activeUser.userInfo.uid; });
        activeUsersArray.unshift(activeUser);
    });

    const eventsRef = firebaseConnection.app.database().ref('events').limitToLast(10);
    eventsRef.on('child_added', (data) => {
        var userEvent = data.val() as Models.UserEvent;
        
        const values = eventsArray();
        eventsArray([]);
        values.unshift(userEvent);
        eventsArray(values.slice(0,9));
    });

    function getUserInfo(user: firebase.User): firebase.UserInfo {
        return {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            providerId: user.providerId
        };   
    }
}