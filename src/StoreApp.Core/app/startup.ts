import * as ko from "knockout";
import { MainViewModel } from "./main";
import { StoreEventsViewModel } from "./components/store-events";
import { StoreMapViewModel } from "./components/store-map";
import { ActiveUsersViewModel } from "./components/active-users";
import { NavMenuViewModel } from "./components/nav-menu";
import * as Moment from "moment";
import * as $ from "jquery";

// register knockout components
ko.components.register("store-events", {
    viewModel: StoreEventsViewModel,
    template: { require: "text!components/store-events.html" }
});
ko.components.register("store-map", {
    viewModel: StoreMapViewModel,
    template: { require: "text!components/store-map.html" }
});
ko.components.register("active-users", {
    viewModel: ActiveUsersViewModel,
    template: { require: "text!components/active-users.html" }
});
ko.components.register("nav-menu", {
    viewModel: NavMenuViewModel,
    template: { require: "text!components/nav-menu.html" }
});

ko.bindingHandlers.moment =
{
    update: function (element, valueAccessor: any, allBindingsAccessor: any)
    {
        return ko.bindingHandlers.text.update(element, function ()
        {
            var value: any = ko.unwrap(valueAccessor());
            if (value == null)
            {
                return null;
            }
            return Moment(value).fromNow();
        }, allBindingsAccessor, null, null);
    }
};

ko.bindingHandlers.fadeToggle = {
    update: function(element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
 
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);
 
        // Grab some more data from another binding property
        var duration = allBindings.get('slideDuration') || 3000; // 400ms is default duration unless otherwise specified
 
        // Now manipulate the DOM element
        $(element).fadeIn(duration,()=>{ $(element).fadeOut(); } ); // Make the element visible
    }
};

// Start our app
var mainViewModel = new MainViewModel();
ko.applyBindings(mainViewModel);

setTimeout(() => { mainViewModel.loading(false); }, 2000);