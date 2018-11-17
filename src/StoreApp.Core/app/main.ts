import * as firebase from "firebase";
import * as ko from "knockout";
import ViewModelBase from "./components/ViewModelBase";

export class MainViewModel extends ViewModelBase {
    loading = ko.observable(true);

    constructor() {
        super();
    }
}