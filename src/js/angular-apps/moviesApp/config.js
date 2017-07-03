moviesApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function(
        $stateProvider,
        $urlRouterProvider)
        {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'js/angular-apps/moviesApp/partials/_movies-list.html'
        });
    }
]);