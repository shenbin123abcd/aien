(function(){
    "use strict";
    angular.module('halo').run(['$rootScope','$state','$timeout','$window','haloBrowser','$location',
    function($rootScope, $state, $timeout,$window,haloBrowser,$location) {
        if(window.appConfig.debug){
            console.log('running in debug mode');
            appConfig.apiBaseUrl='http://college.hx.com';
        }else{
            appConfig.apiBaseUrl='http://college.halobear.com';
        }



        $rootScope.pageTitle='幻熊学院';



        $rootScope.imgPreload='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURfDw8Lu/XasAAAAKSURBVAjXY2AAAAACAAHiIbwzAAAAAElFTkSuQmCC';
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //console.log(event, toState, toParams, fromState, fromParams);
            //console.log(toState, toParams,$location.url());

            $rootScope.toState=toState;
            $rootScope.fromState=fromState;
            $rootScope.fromParams=fromParams;
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //console.log(toState, toParams);
            _hmt.push(['_trackPageview', $location.url()]);

        });
        $rootScope.windowWidth=$($window).width();


        $rootScope.device=haloBrowser.device();
        $rootScope.browser=haloBrowser.browser();
        //alert(haloBrowser.device());


        $($window).on('orientationchange',function(){
            $rootScope.windowWidth=$($window).width();
        });


    }]);
}());
