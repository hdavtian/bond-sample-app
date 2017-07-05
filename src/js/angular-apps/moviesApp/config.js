moviesApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function(
        $stateProvider,
        $urlRouterProvider) {

            $urlRouterProvider.otherwise('/arclight');

            $stateProvider

                .state('arclight', {
                    url: '/arclight',
                    templateUrl: '/js/angular-apps/moviesApp/templates/movie-list.html',
                    controller: ['$rootScope', function($rootScope){
                        //12345
                    }]
                })

                .state('amc', {
                    url: '/amc',
                    templateUrl: '/js/angular-apps/moviesApp/templates/movie-list.html',
                    controller: ['$rootScope', function($rootScope){
                        //12345
                    }]
                })

                .state('pacific', {
                    url: '/pacific',
                    templateUrl: '/js/angular-apps/moviesApp/templates/movie-list.html',
                    controller: ['$rootScope', function($rootScope){
                        //12345
                    }]
                });
    }
]);