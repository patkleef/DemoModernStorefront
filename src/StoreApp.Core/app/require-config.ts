declare var require: any;
require.config({
    paths: {
        "text": "lib/text",
        "knockout": "lib/knockout",
        "knockout-postbox": "lib/knockout-postbox",
        "jquery": "lib/jquery",
        "slick": "lib/slick",
        "google-maps": "lib/google.min",
        "firebase": "lib/firebase",
        "moment": "lib/moment"
    },
    shim: {
        'firebase': {
            exports: 'firebase'
        }
    }
});