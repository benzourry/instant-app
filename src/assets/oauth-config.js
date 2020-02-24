var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');;
var OAUTH = {
        AUTH_URI : "https://rekapi.unimas.my/ia/oauth2/authorize",
        LOGOUT_URI : "https://rekapi.unimas.my/ia/logout",
        USER_URI : "https://rekapi.unimas.my/ia/user/me",
        CALLBACK : full + "/assets/o-callback.html",
        FINAL_URI: full + "/",
        PRIVACY_POLICY: "https://unimas-my.sharepoint.com/:b:/g/personal/blmrazif_unimas_my/EXSTOBT8JfZCq10cY7hCbigBAvyriL00huiKssyImrJutA?e=cvQikb"
}

// var OAUTH = {
//         AUTH_URI : "http://localhost:8882/ia/oauth2/authorize",
//         LOGOUT_URI : "http://localhost:8882/logout",
//         USER_URI : "http://localhost:8882/ia/user/me",
//         CALLBACK : full + "/assets/o-callback.html",
//         FINAL_URI: full + "/"
// }