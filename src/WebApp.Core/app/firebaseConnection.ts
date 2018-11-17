import * as firebase from "firebase";
import * as $ from "jquery";
import * as ko from "knockout";

export module firebaseConnection {
    export var app: firebase.app.App;
    export var loggedInUser = ko.observable<firebase.User>();

    export function getLoggedInUserInfo(){
        return getUserInfo(loggedInUser());
    }

    export function loginWithGoogle(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
    };

    app = firebase.initializeApp(config);

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
        // We ignore token refresh events.
        if (user && loggedInUser && loggedInUser.uid === user.uid) {
            return;
        }

        if (user) {
            loggedInUser(user);
            const userInfo = getUserInfo(user);
            app.database().ref('active-users/' + userInfo.displayName).set({
                userInfo: userInfo,
                lastActive: new Date().getTime()
            });
        }
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

