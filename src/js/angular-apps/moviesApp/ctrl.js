moviesApp.controller('moviesCtrl', [
    '$scope',
    '$http',
    function(
        $scope,
        $http
    ){

        $scope.msg="The sand people are easily startled";

        var movies = [];
        $scope.movies = movies;
        var Movie = function(data){

            var id,
                title,
                rating,
                poster;

            var getId = function(){return id};
            var setId = function(newVal){id=newVal};
            var initId = function(){
                (propNode!=null && propNode != undefined) ? setId(data.id) : null;
            };

            var _constructor = function(){
                initId();
            };

            _constructor();

            return {
                getId: getId
            }

        };

        var getMovies = function(){

            var path = '/js/angular-apps/moviesApp/data/',
                url = 'movie_metadata.json'
            $http({
                method: 'GET',
                url: path + url,
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                // ----------------------------------------------------------
                // success function
                // ----------------------------------------------------------
                console.info('--- movie_metadata ---')
                console.info(response.data);

                for(var i=0,l=response.data.length;i<l;i++){
                    movies.push(response.data[i]);
                }

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                // ----------------------------------------------------------
                // fail function
                // ----------------------------------------------------------

            });
        };

        getMovies();


    }]
);