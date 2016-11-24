(function(){
    "use strict";
    angular.module('halo')
    .factory('authInterceptor', ["$q", "$rootScope", "$window", "$location","haloAuth",
        function($q, $rootScope, $window, $location,haloAuth){
            return {
                'request': function(config){
                    config.headers = config.headers || {};
                    if (typeof config.headers.Authorization == 'undefined' || config.headers.Authorization.length == 0) {//$location.$$path !== '/data/caseAdd'
                        var token = haloAuth.getToken();
                        if (token) {
                            config.headers.Authorization = 'Bearer ' + token;
                        }
                    }
                    return config;
                },
                'responseError': function(response){
                    if (response.status == 500 || response.status == 504) {
                        $rootScope.$broadcast('network-timeout');
                    } else if (response.status == 404) {
                        $rootScope.$broadcast('not-found');
                    }
                    return $q.reject(response);
                }
            };
        }])
    .factory('haloAuth', ["$q", "$rootScope", "$window", "$location",
    function($q, $rootScope, $window, $location){
        var setUser=function(data){
            $window.localStorage.setItem('user', JSON.stringify(data));
        };
        var getUser=function(){
            return JSON.parse($window.localStorage.getItem('user'));
        };

        var setToken=function(data){
            $window.localStorage.setItem('token', JSON.stringify(data));
        };
        var getToken=function(){
            return JSON.parse($window.localStorage.getItem('token'));
        };
        var removeToken=function(){
            $window.localStorage.removeItem('token');
        };
        var removeUser=function(){
            $window.localStorage.removeItem('user');
        };
        var _clear=function(){
            $window.localStorage.removeItem('user');
            $window.localStorage.removeItem('token');
        };
        //$window.localStorage.setItem('user', JSON.stringify(res.data.user));
        //$window.localStorage.setItem('token', JSON.stringify(res.data.token));
        //$window.localStorage.setItem('aaa', JSON.stringify('asd'));
        //console.log(JSON.parse($window.localStorage.getItem('aaa')));
        //$window.localStorage.removeItem('aaa');

        //console.log(getUser(),getToken());
        //alert(getToken());

        return{
            setUser:setUser,
            getUser:getUser,
            removeUser:removeUser,
            setToken:setToken,
            getToken:getToken,
            removeToken:removeToken,
            clear:_clear
        }
    }])
    .factory('haloStaticData', ["$q", "$rootScope", "$window",
    function($q, $rootScope, $window){
        var getCatByAlias=function(alias){
            var api,title,slug,result;
            result={};
            switch (alias){
                case 'qbsp':
                    result.api='/api/getListByCate?cate=all';
                    result.title='全部视频';
                    break;
                case 'kcyj':
                    result.api='/api/getListByCate?cate=1';
                    result.title='课程演讲';
                    break;
                case 'jbcf':
                    result.api='/api/getListByCate?cate=2';
                    result.title='嘉宾采访';
                    break;
                case 'chbs':
                    result.api='/api/getListByCate?cate=3';
                    result.title='策划比赛';
                    break;
                case 'qthd':
                    result.api='/api/getListByCate?cate=4';
                    result.title='其他活动';
                    break;


                case 'zxsx':
                    result.api='/api/getListByType?type=new';
                    result.title='最新上线';
                    break;
                case 'zxsx_index':
                    result.api='/api/getListByType?type=index_new';
                    result.title='最新上线';
                    break;
                case 'zdbf':
                    result.api='/api/getListByType?type=hot';
                    result.title='最多播放';
                    break;
                case 'zdtj':
                    result.api='/api/getListByType?type=score';
                    result.title='最多推荐';
                    break;


                case 'jxzt':
                    result.api='/api/getListByTopic?cate=all';
                    result.title='精选专题';
                    break;

                case '2015-zg-gf':
                    result.api='/api/getListByTopic?cate=wfc2015';
                    result.title='2015中国婚礼行业高峰论坛';
                    break;
                case '2015-zg-jx':
                    result.api='/api/getListByTopic?cate=bear2015';
                    result.title='2015中国婚礼策划金熊奖';
                    break;
                case '2014-zg-gf':
                    result.api='/api/getListByTopic?cate=wfc2014';
                    result.title='2014中国婚礼行业高峰论坛';
                    break;
                case '2013-zg-gf':
                    result.api='/api/getListByTopic?cate=wfc2013';
                    result.title='2013中国婚礼行业高峰论坛';
                    break;
                case '2012-zg-gf':
                    result.api='/api/getListByTopic?cate=wfc2012';
                    result.title='2012中国婚礼行业高峰论坛';
                    break;
                case 'ss':
                    result.api='/api/search';
                    result.title='搜索';
                    break;


                case 'gll':
                    result.api='/api/getListByCate2?cate=1';
                    result.title='管理类';
                    break;
                case 'chl':
                    result.api='/api/getListByCate2?cate=2';
                    result.title='策划类';
                    break;
                case 'yxl':
                    result.api='/api/getListByCate2?cate=3';
                    result.title='营销类';
                    break;
                case 'zcl':
                    result.api='/api/getListByCate2?cate=4';
                    result.title='主持类';
                    break;
                case 'qtl':
                    result.api='/api/getListByCate2?cate=5';
                    result.title='其他类';
                    break;

            }


            return result;

        };

        return{
            getCatByAlias:getCatByAlias

        }
    }])
    .factory('lectureService', ['$resource', '$q','$sce','haloStaticData','haloAuth',function($resource, $q,$sce,haloStaticData,haloAuth){
        var getDetail=function(data){
            var deferred = $q.defer();
            //var news = $resource('/api/lectureDetail');
            //var news = $resource('/fakeapi/lectureDetail');
            var news = $resource('/api/videoDetail');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    if(!res.data.video.url){
                        haloAuth.removeToken();
                    }
                    res.data.video.url=$sce.trustAsResourceUrl(res.data.video.url);
                    //res.data.video.url=$sce.trustAsResourceUrl('http://7s1t37.com2.z0.glb.qiniucdn.com/AQWDY%2F24F_FKLX.mp4');
                    deferred.resolve(res.data);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };
        var getUrl=function(data){
            var deferred = $q.defer();
            var news = $resource('/api/getUrl');
            news.get(data, function(res){
                //console.log(data,res.data);
                if(res.iRet==1){
                    res.data=$sce.trustAsResourceUrl(res.data);
                    deferred.resolve(res.data);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };
        var getRecommendList=function(data){
            var deferred = $q.defer();
            var news = $resource('/api/videoRecommend');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    if($.isArray(res.data)){
                        deferred.resolve(res.data);
                    }else{
                        deferred.resolve([]);
                    }
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };
        var getTotal=function(data){
            data=data||{};
            var deferred = $q.defer();
            var news = $resource('/api/total');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    deferred.resolve(res.data);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };
        var getList=function(alias,data){
            data=data||{};
            //console.log(data);
            var deferred = $q.defer();
            var api,catInfo,title;

            catInfo=haloStaticData.getCatByAlias(alias);
            api=catInfo.api;
            title=catInfo.title;
            var news = $resource(api);
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    switch (true){
                        case typeof data.keyword =='string':
                            res.data.title='"'+data.keyword +'" '+title+'的结果';
                            break;
                        default:
                            res.data.title=title;
                    }
                    //console.log(res.data.total,data.per_page,Math.ceil(Number(res.data.total)/data.per_page));
                    res.data.TotalPages=Math.ceil(Number(res.data.total)/data.per_page);
                    deferred.resolve(res.data);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };
        return{
            getDetail:getDetail,
            getUrl:getUrl,
            getRecommendList:getRecommendList,
            getList:getList,
            getTotal:getTotal
        }
    }])
    .factory('commentService', ['$resource', '$q','$http','haloAuth',function($resource, $q,$http,haloAuth){
        var getList=function(data){
            var deferred = $q.defer();
            var news = $resource('/api/commentList');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    res.data.list.forEach(function(n,i){
                        n.score=Math.floor(n.score);
                        //console.log(new Date(n.create_time*1000));
                        n.create_time=moment(n.create_time*1000).format("YYYY-MM-DD");
                    });
                    deferred.resolve(res.data);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };

        var postComment=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.score:
                        deferred.reject('请选择评分等级');
                        break;
                    case !data.content:
                        deferred.reject('请输入评价内容');
                        break;
                    default:
                        sendXhr();
                }
            };
            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/api/commontSave'
                }).then(function(res){
                    if(res.data.iRet==1){
                        res.data.newComment=$.extend({},data,{
                            create_time:moment().format("YYYY-MM-DD"),
                            username:haloAuth.getUser().username
                        });
                        deferred.resolve(res.data);
                    }else if(res.data.iRet==-1){
                        deferred.reject(-1);
                    }else{
                        deferred.reject(res.data.info);
                    }
                }, function(error){
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        return{
            getList:getList,
            postComment:postComment
        }

    }])
    .factory('liveService', ['$resource', '$q','$http','haloAuth',function($resource, $q,$http,haloAuth){

        var getDetail=function(data){
            var data=data||{};
            data=angular.extend({}, {
                per_page:10,
                page:1
            }, data);

            var deferred = $q.defer();
            var news = $resource('/live/getLiveBrief');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    deferred.resolve(res.data);
                }else{
                    deferred.reject(res);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };

        var getCommentList=function(data){
            var deferred = $q.defer();
            var news = $resource('/live/getCommentList');
            news.get(data, function(res){
                //console.log(data,res);
                if(res.iRet==1){
                    res.data.list.forEach(function(n,i){
                        n.c_create_time=moment(n.create_time*1000).fromNow();
                    });
                    deferred.resolve(res.data);
                }else{
                    deferred.reject(res);
                }
            }, function(error){
                //console.log(res);
                deferred.reject({iRet: 0, info: '网络繁忙请稍候再试', error: error});
            });
            return deferred.promise;

        };


        var postComment=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.contents:
                        deferred.reject('请输入评价内容');
                        break;
                    default:
                        sendXhr();
                }
            };
            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/live/postComments'
                }).then(function(res){
                    if(res.data.iRet==1){
                        deferred.resolve(res.data.info);
                    }else if(res.data.iRet==-1){

                        deferred.reject(res.data.info);
                    }else{
                        deferred.reject(res.data.info);
                    }
                }, function(error){
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        return{
            getDetail:getDetail,
            getCommentList:getCommentList,
            postComment:postComment
        }

    }])
    .factory('haloValidation', [function(){
        var checkPhone=function(num){
            //表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束。
            if(!(/^1[3|4|5|7|8]\d{9}$/.test(num))){
                return false;
            }else{
                return true;
            }
        };
        return{
            checkPhone:checkPhone
        }
    }])

    .factory('haloUtil', ['$q',function($q){
        var _alert=function(options){
            var defaults = {
                title:'提示',
                content:'提示'
            };
            var settings = $.extend( {},defaults, options );
            var alertHtmlStr='' +
                '<div class="weui_dialog_alert" >'+
                '<div class="weui_mask"></div>'+
                '<div class="weui_dialog" style="display: none;" >'+
                '<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+
                settings.title+
                '</strong></div>' +
                '<div class="weui_dialog_bd">'+
                settings.content +
                '</div>' +
                '<div class="weui_dialog_ft">' +
                '<a href="javascript:;" class="weui_btn_dialog primary">确定</a>' +
                '</div>' +
                ' </div>' +
                ' </div>' +
                '';
            var $alertHtml=$(alertHtmlStr);
            $("body").append($alertHtml);
            $alertHtml.find(".weui_dialog").fadeIn(200);
            var $confirmBt=$alertHtml.find(".weui_btn_dialog");
            $confirmBt.on('click',function(){
                $alertHtml.remove();
            });
        };

        var _confirm=function(options){
            var deferred = $q.defer();

            var defaults = {
                title:'提示',
                content:'您确定吗'
            };
            var settings = $.extend( {},defaults, options );
            var confirmHtmlStr='' +
                '<div class="weui_dialog_confirm">' +
                '<div class="weui_mask"></div>' +
                '<div class="weui_dialog">' +
                '<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+settings.title+'</strong></div>' +
                '<div class="weui_dialog_bd">'+settings.content+'</div>' +
                '<div class="weui_dialog_ft">' +
                '<a href="javascript:;" class="weui_btn_dialog default">取消</a>' +
                '<a href="javascript:;" class="weui_btn_dialog primary">确定</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '';

            var $confirmHtml=$(confirmHtmlStr);
            $("body").append($confirmHtml);
            $confirmHtml.find(".weui_dialog").fadeIn(200);
            var $confirmBt=$confirmHtml.find(".weui_btn_dialog.primary");
            $confirmBt.on('click',function(){
                $confirmHtml.remove();
                deferred.resolve(true);
            });
            var $cancelBt=$confirmHtml.find(".weui_btn_dialog.default");
            $cancelBt.on('click',function(){
                $confirmHtml.remove();
                deferred.reject(false);
            });
            return deferred.promise;

        };



        var loading=(function(){
            var loadingHtmlStr='' +
                '<div id="loadingToast" class="weui_loading_toast" >' +
                '<div class="weui_mask_transparent"></div>' +
                '<div class="weui_toast">' +
                '<div class="weui_loading">' +
                '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
                '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
                '</div>' +
                '<p class="weui_toast_content">数据加载中</p>' +
                '</div>' +
                '</div>' +
                '';
            var $loadingHtml=$(loadingHtmlStr);
            var show=function(){
                $("body").append($loadingHtml);
            };
            var hide=function(){
                $loadingHtml.remove();
            };

            return{
                show:show,
                hide:hide
            }
        }());


        var toast=function(msg){
            var toastHtmlStr='' +
                '<div class="weui_msg_toast" >' +
                '<div class="weui_mask_transparent"></div>' +
                '<div class="weui_toast">' +
                '<i class="weui_icon_toast"></i>' +
                '<p class="weui_toast_content">'+msg+'</p>' +
                '</div>' +
                '</div>' +
                '';
            var $toastHtml=$(toastHtmlStr);
            $("body").append($toastHtml);
            var $weui_toast=$toastHtml.find(".weui_toast");
            $weui_toast.fadeIn(200);
            var hideToast=function(){
                $toastHtml.fadeOut(400).remove();
            };
            setTimeout(hideToast,600);
        };



        return{
            alert:_alert,
            confirm:_confirm,
            loading:loading,
            toast:toast
        }
    }])
    .factory('userService', ['$resource', '$q','haloValidation','$http',function($resource, $q,haloValidation,$http){
        var getVerifyCode=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    //case !data.invite_code:
                    //    deferred.reject('请输入邀请码');
                    //    break;
                    case !data.phone:
                        deferred.reject('请输入手机号');
                        break;
                    case !haloValidation.checkPhone(data.phone):
                        deferred.reject('您的手机号格式错误');
                        break;
                    default:
                        sendXhr()
                }
            };
            //var xhr = $resource('/api/lectureDetail');
            //var xhr = $resource('/fakeapi/lectureDetail');
            var sendXhr=function(){
                var xhr = $resource('/api/verify');
                xhr.get(data, function(res){
                    //console.log(data,res);
                    if(res.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.info);
                    }
                }, function(error){
                    //console.log(res);
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        var getResetPasswordVerifyCode=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.phone:
                        deferred.reject('请输入手机号');
                        break;
                    case !haloValidation.checkPhone(data.phone):
                        deferred.reject('您的手机号格式错误');
                        break;
                    default:
                        sendXhr()
                }
            };
            //var xhr = $resource('/api/lectureDetail');
            //var xhr = $resource('/fakeapi/lectureDetail');
            var sendXhr=function(){
                var xhr = $resource('/api/forgetCode');
                xhr.get(data, function(res){
                    //console.log(data,res);
                    if(res.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.info);
                    }
                }, function(error){
                    //console.log(res);
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        var register=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.verify_code:
                        deferred.reject('请输入验证码');
                        break;
                    case data.verify_code.length!==6:
                        deferred.reject('您的6位数字验证码错误');
                        break;
                    case !data.username:
                        deferred.reject('请输入昵称');
                        break;
                    case data.username.length<2||data.username.length>20:
                        deferred.reject('昵称长度2-20个字符');
                        break;
                    case !data.city:
                        deferred.reject('请输入城市');
                        break;
                    case !data.company:
                        deferred.reject('请输入公司');
                        break;
                    case !data.wechat:
                        deferred.reject('请输入微信号');
                        break;
                    case !data.password:
                        deferred.reject('请输入密码');
                        break;
                    case data.password.length<6||data.password.length>32:
                        deferred.reject('密码长度6-32个字符');
                        break;

                    default:
                        sendXhr();
                }
            };
            //var xhr = $resource('/api/lectureDetail');
            //var xhr = $resource('/fakeapi/lectureDetail');

            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/api/register'
                }).then(function(res){
                    //console.log(data,res);
                    if(res.data.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.data.info);
                    }
                }, function(error){
                    //console.log(res);
                    deferred.reject('网络繁忙请稍候再试');
                });
                //return deferred.promise
            };
            init();
            return deferred.promise;
        };

        var login=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.phone:
                        deferred.reject('请输入手机号');
                        break;
                    case !haloValidation.checkPhone(data.phone):
                        deferred.reject('您的手机号格式错误');
                        break;
                    case !data.password:
                        deferred.reject('请输入密码');
                        break;
                    default:
                        sendXhr();
                }
            };
            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/api/login'
                }).then(function(res){
                    if(res.data.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.data.info);
                    }
                }, function(error){
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        var resetPassword=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.phone:
                        deferred.reject('请输入手机号');
                        break;
                    case !haloValidation.checkPhone(data.phone):
                        deferred.reject('您的手机号格式错误');
                        break;
                    case !data.verify_code:
                        deferred.reject('请输入验证码');
                        break;
                    case data.verify_code.length!==6:
                        deferred.reject('您的6位数字验证码错误');
                        break;
                    case !data.password:
                        deferred.reject('请输入密码');
                        break;
                    case data.password.length<6||data.password.length>32:
                        deferred.reject('密码长度6-32个字符');
                        break;
                    case !data.rpassword:
                        deferred.reject('请重复密码');
                        break;
                    case data.password!=data.rpassword:
                        deferred.reject('您两次输入的密码不一致');
                        break;
                    default:
                        sendXhr();
                }
            };
            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/api/forget'
                }).then(function(res){
                    if(res.data.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        deferred.reject(res.data.info);
                    }
                }, function(error){
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };
        var changePassword=function(data){
            var deferred = $q.defer();
            var init=function(){
                data=data||{};
                switch (true){
                    case !data.password:
                        deferred.reject('请输入原密码');
                        break;
                    case !data.new_password:
                        deferred.reject('请输入新密码');
                        break;
                    case data.new_password.length<6||data.new_password.length>32:
                        deferred.reject('密码长度6-32个字符');
                        break;
                    case !data.rnew_password:
                        deferred.reject('请重复新密码');
                        break;
                    case data.new_password!=data.rnew_password:
                        deferred.reject('您两次输入的密码不一致');
                        break;
                    default:
                        sendXhr();
                }
            };
            var sendXhr=function(){
                $http({
                    method: 'POST',
                    data : data ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest : function(data){
                        return $.param(data,true)
                    },
                    url: '/api/editPassword'
                }).then(function(res){
                    if(res.data.iRet==1){
                        deferred.resolve(res.data);
                    }else{
                        switch (res.data.info){
                            case 'Old password is wrong':
                                deferred.reject('原密码错误');
                                break;
                            default:
                                deferred.reject(res.data.info);
                        }
                    }
                }, function(error){
                    deferred.reject('网络繁忙请稍候再试');
                });
            };
            init();
            return deferred.promise;
        };


        return{
            getVerifyCode:getVerifyCode,
            getResetPasswordVerifyCode:getResetPasswordVerifyCode,
            register:register,
            login:login,
            resetPassword:resetPassword,
            changePassword:changePassword
        }
    }])
    .factory('userModal', ['$resource', '$q','$sce','$uibModal','userService','haloUtil','$interval','$window','haloAuth',
    function($resource, $q,$sce,$uibModal,userService,haloUtil,$interval,$window,haloAuth){
        //var modalInstance;
        //$window.localStorage.setItem('aaa', JSON.stringify('asd'));
        //console.log(JSON.parse($window.localStorage.getItem('aaa')));
        //$window.localStorage.removeItem('aaa');
        var ctrlFunction=function($scope,$uibModalInstance,userModalData,lectureService){
            var vm;
            $scope.vm=vm={};
            var init=function(){
                if(token){
                    vm.showLayer='注销';

                }else{
                    vm.showLayer='登录';
                    //vm.showLayer='注册信息';
                }

            };
            var token=haloAuth.getToken();

            var startCount = function() {
                vm.counting=60;
                $interval(function() {
                    vm.counting-=1;
                }, 1000,60);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            vm.ok = function () {
                $uibModalInstance.close('ok');
            };
            vm.goRegister = function () {
                vm.showLayer='注册';
            };
            vm.goLogin = function () {
                vm.showLayer='登录';
            };
            vm.goGetResetPasswordCode = function () {
                vm.showLayer='获取忘记密码验证码';
            };
            vm.goResetPassword = function () {
                vm.showLayer='忘记密码';
            };

            vm.getVerifyCode = function (regData) {
                regData=regData||{};
                haloUtil.loading.show();
                userService.getVerifyCode({
                    //invite_code: $.trim(regData.invite_code||''),
                    invite_code: 'halobear',
                    phone:$.trim(regData.phone||'')
                }).then(function(res){
                    haloUtil.loading.hide();
                    startCount();
                    vm.showLayer='注册信息'
                },function(res){
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                });
            };

            vm.getResetPasswordVerifyCode = function (data) {
                data=data||{};
                haloUtil.loading.show();
                userService.getResetPasswordVerifyCode({
                    phone:$.trim(data.phone||'')
                }).then(function(res){
                    haloUtil.loading.hide();
                    startCount();
                    vm.showLayer='重置密码'
                },function(res){
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                });
            };

            vm.resetPassword = function (data) {
                data=data||{};
                haloUtil.loading.show();
                userService.resetPassword({
                    phone:$.trim(data.phone||''),
                    verify_code:$.trim(data.verify_code||''),
                    password:data.password||'',
                    rpassword:data.rpassword||''
                }).then(function(res){
                    haloUtil.loading.hide();
                    haloUtil.toast(res.info);
                    vm.showLayer='登录';
                    vm.logData=vm.logData||{};
                    vm.logData.phone=data.phone;
                },function(res){
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                });
            };

            vm.register = function (regData) {
                regData=regData||{};
                haloUtil.loading.show();
                userService.register({
                    //invite_code:$.trim(regData.invite_code||''),
                    invite_code:'halobear',
                    phone:$.trim(regData.phone||''),
                    verify_code:$.trim(regData.verify_code||''),
                    username:$.trim(regData.username||''),
                    company:$.trim(regData.company||''),
                    city:$.trim(regData.city||''),
                    wechat:$.trim(regData.wechat||''),
                    password:regData.password||''
                }).then(function(res){
                    //console.log('success',res);
                    haloUtil.loading.hide();
                    haloUtil.toast(res.info);
                    haloAuth.setToken(res.data.token);
                    haloAuth.setUser(res.data.user);
                    $uibModalInstance.close('register succeeded');

                },function(res){
                    //console.log('err',res);
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                })
                ;
            };
            vm.login=function(data){
                data=data||{};
                haloUtil.loading.show();
                userService.login({
                    phone:$.trim(data.phone||''),
                    password:data.password||''
                }).then(function(res){
                    //console.log('success',res);
                    haloUtil.loading.hide();
                    haloUtil.toast(res.info);
                    haloAuth.setToken(res.data.token);
                    haloAuth.setUser(res.data.user);
                    $uibModalInstance.close('login succeeded');
                },function(res){
                    //console.log('err',res);
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                })
                //.then(function(res){
                //    console.log(res,userModalData);
                //    return lectureService.getUrl({
                //        vid:userModalData.videoId
                //    });
                //}).then(function(res){
                //    $uibModalInstance.close(res);
                //},function(res){
                //    console.log('通知更新页面上的url err',res);
                //    haloUtil.alert({
                //        title: '提示',
                //        content: res
                //    });
                //})
                ;
            };
            vm.logout=function(){
                haloAuth.removeToken();
                $uibModalInstance.close('user logout');
            };
            vm.goChangePassword=function(){
                vm.showLayer='修改密码';
                //haloUtil.alert({
                //    title: '提示',
                //    content: '抱歉，暂时不能修改密码，您可以先用忘记密码看来重置密码，敬请期待'
                //});
            };

            vm.changePassword = function (data) {
                data=data||{};
                haloUtil.loading.show();
                userService.changePassword({
                    password:data.password||'',
                    new_password:data.new_password||'',
                    rnew_password:data.rnew_password||''
                }).then(function(res){
                    haloUtil.loading.hide();
                    haloUtil.toast(res.info);
                    vm.cancel();
                },function(res){
                    haloUtil.loading.hide();
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                });
            };


            init();

        };

        var open=function(data){


                var modalInstance = $uibModal.open({
                    templateUrl: "Public/College/views/common/userModal.html"+appConfig.bust,
                    controller: ['$scope','$uibModalInstance','userModalData','lectureService',ctrlFunction],
                    backdrop: 'static',
                    windowClass: 'modal-open--user-modal',
                    openedClass: 'modal-open--body--user-modal',
                    resolve: {
                        userModalData: function () {
                            return data;
                        }
                    }
                })
                ;
                return modalInstance;

            };



        //open();
        //haloUtil.toast('注册成功');


        return{
            open:open
        }
    }])
	.service('wechat', ['$resource', '$window', '$location',
    function($resource, $window, $location){
		var default_data = {
			title: '幻熊在线学院免费版',
			desc: '500位行业大咖，2000小时在线视频，完全免费的幻熊在线学院，婚礼人学习必备！',
			link: $location.absUrl().split('#')[0],
			img: 'http://7xopel.com2.z0.glb.qiniucdn.com/College/images/college_cover3.jpg?imageView/1/w/150/h/150'
		};
        this.init = function(share) {
            if($window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != "micromessenger"){
                return ;
            }
            $.getScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function(data, textStatus) {
                if (textStatus == 'success') {
                    act(typeof share != 'undefined' ? share : default_data);
                }
            });
        };
		
        function act(data) {
            var obj = $resource('/api/getWechat?url=' + encodeURIComponent($location.absUrl().split('#')[0]));
            obj.get(function(ret){
                wx.config($.extend({
                    debug: 0,
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ']
                }, ret));
                wx.ready(function() {

                    wx.onMenuShareTimeline({
                        title: data.desc,
                        desc: data.desc,
                        link:  data.link,
                        imgUrl:  data.img,
                        dataUrl: '',
                        success: function(res) {},
                        cancel: function() {}
                    });
                    wx.onMenuShareAppMessage({
                        title: data.title,
                        desc: data.desc,
                        link:  data.link,
                        imgUrl:  data.img,
                        dataUrl: '',
                        success: function(res) {},
                        cancel: function() {}
                    });
                    wx.onMenuShareQQ({
                        title: data.title,
                        desc: data.desc,
                        link:  data.link,
                        imgUrl:  data.img,
                        dataUrl: '',
                        success: function(res) {},
                        cancel: function() {}
                    });
                });
            });
        }
    }])
    .factory('haloBrowser', ['$window',function($window){


        //this.versions = function(){
        //    var u = $window.navigator.userAgent, app = $window.navigator.appVersion;
        //    return {         //移动终端浏览器版本信息
        //        trident: u.indexOf('Trident') > -1, //IE内核
        //        presto: u.indexOf('Presto') > -1, //opera内核
        //        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        //        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        //        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        //        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        //        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        //        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        //        iPad: u.indexOf('iPad') > -1, //是否iPad
        //        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        //    };
        //}();

        var device = function(){
            var u = $window.navigator.userAgent, app = $window.navigator.appVersion;
            switch (true){
                case (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1):
                    return "android";
                    break;
                case (u.indexOf('iPhone') > -1):
                    return "iPhone";
                    break;
                case (u.indexOf('iPad') > -1):
                    return "iPhone";
                    break;
                default:
                    return "unknown-device";
            }
        };
        var browser = function(){
            var u = $window.navigator.userAgent, app = $window.navigator.appVersion;
            switch (true){
                case (u.indexOf('MicroMessenger') > -1) :
                    return "weixin";
                    break;
                default:
                    return "unknown-browser";
            }
        };

        //this.language = ($window.navigator.browserLanguage || $window.navigator.language).toLowerCase();
        //
        //this.check = function(){
        //    var str = 'unknown';
        //    if (this.versions.mobile) {
        //        var ua = $window.navigator.userAgent.toLowerCase();//获取判断用的对象
        //
        //        if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //            str = '微信';
        //        }else if (ua.match(/WeiBo/i) == "weibo") {
        //            str = '微博';
        //        }else if (ua.match(/QQ/i) == "qq") {
        //            str = 'QQ';
        //        }else if (this.versions.ios) {
        //            str = '苹果浏览器';
        //        }else if(this.versions.android){
        //            str = '安卓浏览器';
        //        }
        //    } else {
        //        str = '官网';
        //    }
        //    return str;
        //};


        return {
            device:device,
            browser:browser
        };


    }])

    ;
}());
