(function(){
    "use strict";
    window.appConfig={};
    window.appConfig.debug=!false;
    window.appConfig.version='1.0.0';

    if(window.appConfig.debug){
        window.appConfig.bust='?v='+(new Date().getTime());
    }else{
        window.appConfig.bust='?v='+window.appConfig.version;
    }
}());