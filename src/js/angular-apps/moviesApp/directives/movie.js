moviesApp.directive('movie', function(){
    return {
        restrict: 'EA',
        scope: {
            title: '@title',
            movieObj: '='
        },
        templateUrl: '/js/angular-apps/moviesApp/partials/_movie.html'
    }
});
// 1233456789
