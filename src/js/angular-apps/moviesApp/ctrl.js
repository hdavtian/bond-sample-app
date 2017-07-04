moviesApp.controller('moviesCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    function(
        $scope,
        $rootScope,
        $http
    ){
        $rootScope.msg = 'harmad';
        $scope.msg = 'harma';

        var Theaters = [];
        $scope.Theaters = Theaters;
        var Movies = [];
        $scope.Movies = Movies;

        var currentList = [];
        $scope.currentList = currentList;

        var Movie = (function(){

            var getTitleById = function(movies, movieId){
                var _title;
                for (var i=0, l=movies.length; i<l; i++) {
                    if (movies[i].id == movieId) {
                        _title = movies[i].title;
                        break;
                    }
                }
                return _title;
            };

            var getAttrById = function(movies, movieId, attr){
                var _attr;
                for (var i=0, l=movies.length; i<l; i++) {
                    if (movies[i].id == movieId) {
                        _attr = movies[i][attr];
                        break;
                    }
                }
                return _attr;
            };

            return {
                getTitleById: getTitleById,
                getAttrById: getAttrById
            }
        })();

        var setMovieListPerTheater = function(theaterId){

            // found on SO
            function valuesToArray(obj) {
                return Object.keys(obj).map(function (key) { return obj[key]; });
            };

            for (var i=0, l=Theaters.length; i<l; i++) {
                if (Theaters[i].id == theaterId) {
                    //alert(Theaters[i].showtimes.length);1234567
                    console.info('dee');
                    console.info(Object.keys(Theaters[i].showtimes)[1]);
                    console.info(Theaters[i].showtimes);
                    console.info(valuesToArray(Theaters[i].showtimes));
                    console.info(valuesToArray(Theaters[i].showtimes).length);

                    var showtimesArr = valuesToArray(Theaters[i].showtimes);

                    for (var n=0, len=showtimesArr.length; n<len; n++) {
                        $scope.currentList.push({
                            id: Object.keys(Theaters[i].showtimes)[n],
                            title: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'title'),
                            rating: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'rating'),
                            poster: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'poster'),
                            showtimes: showtimesArr[n]
                        })

                    }
                }
            }
        };

        $scope.getPacificMovies = function(){
            $scope.currentList = [];
            setMovieListPerTheater('58f3356c0ffe87bcb324454056587b67')
        };

        $scope.getArclightMovies = function(){
            $scope.currentList = [];
            setMovieListPerTheater('2030c64ce72b4e4605cb01f2ba405b7d')
        };

        $scope.getAmcMovies = function(){
            $scope.currentList = [];
            setMovieListPerTheater('af3de16703f2af385a6941de07f076a0')
        };

        var getMoviesInfo = function(){
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
                    Movies.push(response.data[i]);
                }

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                // ----------------------------------------------------------
                // fail function
                // ----------------------------------------------------------

            });
        };

        var getTheatersInfo = function(){
            var path = '/js/angular-apps/moviesApp/data/',
                url = 'theater_showtimes.json'
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
                    Theaters.push(response.data[i]);
                }

                setMovieListPerTheater('2030c64ce72b4e4605cb01f2ba405b7d');

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                // ----------------------------------------------------------
                // fail function
                // ----------------------------------------------------------

            });
        };

        var init = function(){
            getMoviesInfo();
            getTheatersInfo();
        };

        init();

    }]
);
//123
//234