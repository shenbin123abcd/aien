(function(){
    "use strict";
    angular.module('halo')
    .controller('lectureDetailCtrl', ['$rootScope','$scope', '$timeout','lectureService','$stateParams','commentService','haloUtil','haloAuth','userModal','$q', '$location', 'wechat',
    function($rootScope,$scope, $timeout,lectureService,$stateParams,commentService,haloUtil,haloAuth,userModal,$q, $location, wechat) {

        $scope.vm={};
        var vm=$scope.vm;
        vm.rateData={};
        var promise1=$q.defer(),promise2=$q.defer(),promise3=$q.defer();
        $q.all([promise1.promise, promise2.promise, promise2.promise]).then(function() {
            vm.allDataReceived=true;
        });
        $scope.$on('user logout',function(){
            //vm.data.video.url=undefined;
        });
        $scope.$on('login succeeded',function(){
            getDetail();
        });
        $scope.$on('register succeeded',function(){
            getDetail();
        });
        var init=function(){
            vm.allDataReceived=false;
            getDetail();
            vm.commentListCurrentPage=1;
            vm.commentList=[];
            vm.getNextCommentList();
            vm.getRecommendVideoList();
            resetCommentData();
        };
        function getDetail(){
            lectureService.getDetail({
                id:$stateParams.id
            }).then(function(res){
                //console.log(res);
                promise1.resolve('');
                //res.guests.avatar_url+='@1e_1c_142w_142h';
                res.guests.avatar_url+='?imageView/2/w/142/h/142';
                vm.data=res;
                $rootScope.pageTitle=res.video.title+' | 幻熊学院';
				wechat.init({title: $rootScope.pageTitle, link: $location.absUrl().split('#')[0].split('#')[0], desc: res.guests.content, img: res.guests.avatar_url});
            });
        }
        vm.getNextCommentList=function(page){
            vm.gettingMorecommentList=true;
            commentService.getList({
                vid:$stateParams.id,
                page:vm.commentListCurrentPage,
                per_page:3
            }).then(function(res){
                if(vm.commentListCurrentPage==1){promise2.resolve('');}
                vm.gettingMorecommentList=false;
                vm.commentListCurrentPage++;
                //console.log(res);
                vm.commentList=vm.commentList.concat(res.list);
                vm.commentListTotal=res.total;
            });
        };
        vm.getRecommendVideoList=function(page){
            lectureService.getRecommendList({
                vid:$stateParams.id
            }).then(function(res){
                promise3.resolve('');
                res.forEach(function(n,i){
                    n.cover_url+='?imageView/2/w/268/h/180';
                });
                vm.recommendCommentList=res;
            });
        };
        function resetCommentData(){
            vm.rateData={
                score:5,
                content:''
            };
        }
        vm.postComment=function(data){
            //alert(haloAuth.getToken());
            if(!haloAuth.getToken()){
                userModal.open().result.then(function(res){
                    getDetail();
                })
                ;
                //haloUtil.confirm({
                //    title:'提示',
                //    content:'您需要登录才能发表评论'
                //}).then(function(res){
                //    if(res){
                //        userModal.open();
                //    }
                //});
                return;
            }
            haloUtil.loading.show();
            data=data||{};
            commentService.postComment({
                content: $.trim(data.content||''),
                vid:$stateParams.id,
                score:data.score
            }).then(function(res){
                haloUtil.loading.hide();
                haloUtil.toast(res.info);
                resetCommentData();
                vm.commentList.unshift(res.newComment);
                //vm.commentListTotal+=1;
            },function(res){
                haloUtil.loading.hide();
                if(res==-1){
                    userModal.open();
                    //haloUtil.confirm({
                    //    title:'提示',
                    //    content:'您的登录信息已过期，请重新登录'
                    //}).then(function(res){
                    //    if(res){
                    //        userModal.open();
                    //    }
                    //});
                }else{
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                }

            })
            ;
        };
        vm.getVideoUrl=function(){
            userModal.open(
                {videoId:$stateParams.id}
            ).result.then(function(res){
                getDetail();
            });
        };

        //userModal.resault().then(function(res){
        //    if(res=='login succeeded'){
        //        getDetail();
        //    }
        //},function(res){
        //
        //});



        init();



    }])
    .controller('lectureListCtrl', ['$rootScope','$scope', '$timeout','lectureService','$stateParams','$q', 'wechat',
    function($rootScope,$scope, $timeout,lectureService,$stateParams,$q, wechat) {
        $scope.vm={};
        var vm=$scope.vm;
        if($stateParams.alias=='ss'){
            vm.headerRight='search';
        }else{
            vm.headerRight='login';
        }
        var promise1=$q.defer();
        $q.all([promise1.promise]).then(function() {
            vm.allDataReceived=true;
        });

        var init=function(){
            vm.allDataReceived=false;
            vm.listCurrentPage=1;
            vm.listTotalPages=1;
            vm.list=[];
            vm.getNextList();
        };
        vm.getNextList=function(page){
            //console.log($stateParams);
            vm.gettingMoreList=true;
            lectureService.getList($stateParams.alias,{
                per_page:12,
                keyword:$stateParams.keyword,
                page:vm.listCurrentPage
            }).then(function(res){
                promise1.resolve('');
                vm.gettingMoreList=false;
                vm.listCurrentPage++;
                //console.log(res);
                vm.listTitle=res.title;
                $rootScope.pageTitle=res.title+' | 幻熊学院';

                vm.listTotalPages=res.TotalPages;

                res.list.forEach(function(n,i){
                    n.cover_url+='?imageView/2/w/268/h/180';
                });
                vm.list=vm.list.concat(res.list);
                vm.listTotal=res.total;

				wechat.init();
            });
        };
        init();



    }])
    .controller('homeCtrl', ['$rootScope','$scope', '$timeout','lectureService','$stateParams','userModal','haloStaticData','$q', 'wechat',
    function($rootScope,$scope, $timeout,lectureService,$stateParams,userModal,haloStaticData,$q, wechat) {
        //console.log('homeCtrl');
        $scope.vm={};
        $scope.userModal=userModal;
        var vm=$scope.vm;
        $rootScope.pageTitle='幻熊学院';
        var promise1=$q.defer(),promise2=$q.defer();
        $q.all([promise1.promise, promise2.promise]).then(function() {
            vm.allDataReceived=true;
        });

        $scope.$on('userModal opened',function(){
            //console.log('userModal opened');
            $scope.$broadcast('userModal opened from home');
        });
        $scope.$on('userModal closed',function(){
            //console.log('userModal opened');
            $scope.$broadcast('userModal closed from home');
        });
        var init=function(){
            vm.allDataReceived=false;
            vm.hotList=[
                {
                    alias:'zxsx',
                    list:[]
                },
                {
                    alias:'zdbf',
                    list:[]
                },
                {
                    alias:'zdtj',
                    list:[]
                }
            ];
            vm.topicList=[
                {
                    alias:'2015-zg-gf',
                    slug:'平凡的我  不平凡的我们',
                    pic:'Public/College/images/home-topic-1.png'
                },
                {
                    alias:'2015-zg-jx',
                    slug:'为你的努力加冕',
                    pic:'Public/College/images/home-topic-2.png'
                },
                {
                    alias:'2014-zg-gf',
                    slug:'全新挑战与现实选择',
                    pic:'Public/College/images/home-topic-3.png'
                },
                {
                    alias:'2013-zg-gf',
                    slug:'在变革中实现共赢',
                    pic:'Public/College/images/home-topic-4.png'
                },
                {
                    alias:'2012-zg-gf',
                    slug:'寻求共同发展',
                    pic:'Public/College/images/home-topic-5.png'
                }
            ];
            getHotList();
            getTopicInfo();
            getAllTopicInfo();
            getTotal();
			wechat.init();
        };
        function getHotList(){
            vm.hotList.forEach(function(n,i){
                if(n.alias=='zxsx'){
                    getList('zxsx_index');
                }else{
                    getList(n.alias);
                }
                function getList(alias){
                    lectureService.getList(alias,{
                        per_page:6,
                        page:1
                    }).then(function(res){
                        promise1.resolve('');
                        res.list.forEach(function(n,i){
                            n.cover_url+='?imageView/2/w/232/h/216';
                        });
                        vm.hotList[i].list=res.list;
                        vm.hotList[i].listTitle=res.title;
                        vm.hotList[i].listTotal=res.total;
                    });
                }
            });
        }
        function getTotal(){
            lectureService.getTotal().then(function(res){
                vm.statistics=res;
            });

        }
        function getAllTopicInfo(){
            lectureService.getList('jxzt',{
                per_page:6,
                page:1
            }).then(function(res){
                promise2.resolve('');
                vm.allTopic={};
                vm.allTopic.title=res.title;
                vm.allTopic.listTotal=res.total;
            });
        }
        function getTopicInfo(){
            vm.topicList.forEach(function(n,i){
                var catInfo;
                catInfo=haloStaticData.getCatByAlias(n.alias);
                vm.topicList[i].title=catInfo.title;
            });
        }

        init();



    }])
    .controller('liveDetailCtrl', ['$rootScope','$scope', '$timeout','lectureService','$stateParams','userModal','haloStaticData','$q', 'liveService','haloUtil','haloAuth',
    function($rootScope,$scope, $timeout,lectureService,$stateParams,userModal,haloStaticData,$q, liveService,haloUtil,haloAuth) {
        //console.log('homeCtrl');
        $scope.vm={};
        $scope.userModal=userModal;
        var vm=$scope.vm;
        $rootScope.pageTitle='直播';
        vm.getNextCommentList=getNextCommentList;
        vm.getNextDes=getNextDes;
        vm.comment=comment;
        vm.commentData={};




        var init=function(){
            getDetail({
                live_id:$stateParams.id,
                per_page:10,
                page:1
            });
            getCommentList({
                live_id:$stateParams.id,
                per_page:10,
                page:1
            });
        };

        function listenSocket(){
            var socket = io('http://im.halobear.com:2120');
            socket.on('new_msg', function(msg){
                //$('#messages').append($('<li>').text(msg));
                //console.log(msg);
                //console.log(JSON.parse(msg));

                //var tmpObj={
                //    avatar:"http://7kttnj.com2.z0.glb.qiniucdn.com/avatar/0a71d933fe72f80a1072c24d905aa350!middle",
                //    comment_time:"2016年02月19日",
                //    contents:"非常棒，结婚吧，哈哈哈",
                //    create_time:"1455853753",
                //    live_id: "1",
                //    uid:"1",
                //    username:"hahaa"
                //};
                var tmpObj=JSON.parse(msg);
                tmpObj.c_create_time=moment(tmpObj.create_time*1000).fromNow();
                $scope.$apply(function(){
                    vm.commentData.list.unshift(tmpObj);
                });

            });
        }
        function getDetail(data){
            vm.liveDataLoading=true;

            liveService.getDetail(data).then(function(res){

                vm.liveDataLoading=false;
                vm.liveOpt={
                    live_url:res.live_url
                };
                res.list.forEach(function(n,i){
                    n.c_avatar_url=n.avatar_url+'?imageView/2/w/110/h/110';
                    n.video.forEach(function(n,i){
                        n.c_cover_url=n.cover_url+'?imageView/2/w/186/h/124';
                    })
                });
                vm.liveData=res;
                vm.liveData.per_page=data.per_page;
                vm.liveData.page=++data.page;
                //console.log(res)

            });
        }

        function getNextDes(){
            vm.liveDataLoading=true;
            liveService.getDetail({
                live_id:$stateParams.id,
                per_page:vm.liveData.per_page,
                page:vm.liveData.page
            }).then(function(res){
                vm.liveDataLoading=false;
                res.list.forEach(function(n,i){
                    n.c_avatar_url=n.avatar_url+'?imageView/2/w/110/h/110';
                });
                vm.liveData.list=vm.liveData.list.concat(res.list);
                vm.liveData.page++;
                vm.liveData.total=res.total
            });
        }

        function getCommentList(data){
            vm.commentDataLoading=true;
            liveService.getCommentList(data).then(function(res){
                vm.commentDataLoading=false;
                vm.commentData=res;
                vm.commentData.per_page=data.per_page;
                vm.commentData.page=++data.page;
                listenSocket();
            });
        }
        function getNextCommentList(data){
            vm.commentDataLoading=true;
            liveService.getCommentList({
                live_id:$stateParams.id,
                per_page:vm.commentData.per_page,
                page:vm.commentData.page
            }).then(function(res){
                //console.log(res.list);
                //console.log(vm.commentData.list);
                vm.commentDataLoading=false;
                vm.commentData.list=vm.commentData.list.concat(res.list);
                vm.commentData.page++;
                vm.commentData.total=res.total
            });
        }

        function comment(data){
            if(!haloAuth.getToken()){
                userModal.open()
                ;
                return;
            }
            haloUtil.loading.show();
            liveService.postComment({
                live_id:$stateParams.id,
                contents:data.contents
            }).then(function(res){
                haloUtil.loading.hide();
                data.contents='';
                haloUtil.toast(res);
            },function(res){
                haloUtil.loading.hide();
                //alert(res);

                if(res=='Access denied'){
                    haloAuth.clear();
                    userModal.open();
                }else{
                    haloUtil.alert({
                        title: '提示',
                        content: res
                    });
                }
            });
        }




        init();



    }])
    ;
}());
