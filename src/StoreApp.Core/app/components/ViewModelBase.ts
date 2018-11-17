declare var componentHandler: any;
export default class ViewModelBase {
    upgradeMaterialDesign() {
        if (!(typeof (componentHandler) == "undefined")) {
            componentHandler.upgradeAllRegistered();
        }
    }

    constructor() {
        this.upgradeMaterialDesign();
    }
}