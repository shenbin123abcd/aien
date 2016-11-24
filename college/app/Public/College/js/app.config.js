/**
 * Created by Administrator on 2016/1/20.
 */
(function(){
    "use strict";
    angular.module('halo').config(['$stateProvider','$urlRouterProvider','$locationProvider','$httpProvider','$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,$ocLazyLoadProvider){
        //console.log('config');
        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');
        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'Public/College/views/home.html'+appConfig.bust,
                data: { pageTitle: '首页' },
                controller: 'homeCtrl',
                resolve: {
                    loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: [
                                    'Public/College/js/lib/Swiper/3.3.0/dist/css/swiper.css',
                                    'Public/College/js/lib/Swiper/3.3.0/dist/js/swiper.jquery.js',
                                    'Public/College/js/lib/video.js/5.5.3/dist/video-js.css',
                                    'Public/College/js/lib/video.js/5.5.3/dist/video.js'
                                ]
                            }
                        ]);
                    }]
                }
            })
            .state('lectureList', {
                url: "/lectureList/:alias?keyword",
                templateUrl: "Public/College/views/lectureList.html"+appConfig.bust,
                data: { pageTitle: '课程列表' },
                controller: 'lectureListCtrl'
            })
            .state('lectureDetail', {
                url: "/lectureDetail/:id",
                templateUrl: "Public/College/views/lectureDetail.html"+appConfig.bust,
                data: { pageTitle: '课程详细' },
                controller: 'lectureDetailCtrl',
                resolve: {
                    loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: [
                                    'Public/College/js/lib/video.js/5.5.3/dist/video-js.css',
                                    'Public/College/js/lib/video.js/5.5.3/dist/video.js'
                                    //'Public/College/js/lib/videojs-contrib-ads/src/videojs.ads.css',
                                    //'Public/College/js/lib/videojs-contrib-ads/src/videojs.ads.js'
                                ]
                            }
                        ]);
                    }]
                }
            })
            .state('liveDetail', {
                url: "/videolive/:id",
                templateUrl: "Public/College/views/liveDetail.html"+appConfig.bust,
                data: { pageTitle: '课程详细' },
                controller: 'liveDetailCtrl',
                resolve: {
                    loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: [
                                    'Public/College/js/lib/Swiper/3.3.0/dist/css/swiper.css',
                                    'Public/College/js/lib/Swiper/3.3.0/dist/js/swiper.jquery.js',
                                    'http://qzonestyle.gtimg.cn/open/qcloud/video/live/h5/live_connect.js',
                                    'http://cdn.bootcss.com/socket.io/1.3.7/socket.io.js'
                                ]
                            }
                        ]);
                    }]
                }
            })
        ;
        $httpProvider.interceptors.push('authInterceptor');

    }]);
}());