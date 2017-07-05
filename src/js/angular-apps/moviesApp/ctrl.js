/**
 * @description sample movie app for bond, fun challenge project before interview
 * @author Harma Davtian
 */
moviesApp.controller('moviesCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    function(
        $scope,
        $rootScope,
        $http
    ){

        var Theaters = [];
        $scope.Theaters = Theaters;
        var Movies = [];
        $scope.Movies = Movies;

        var currentList = [];
        $scope.currentList = currentList;

        /**
         * @desc Static object (IIFE), no initialization needed, returns two methods to lookup movie info (Good'ol module pattern!)
         * @type {{getTitleById, getAttrById}}
         */
        var Movie = (function(){

            /**
             * @desc returns movie title
             * @param array movies (array of objects)
             * @param string movieId
             * @returns string title
             */
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

            /**
             * @desc returns desired json attribute from source
             * @param array movies (array of objects)
             * @param string movieId
             * @param string attr
             * @returns string title
             */
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

        /**
         * @desc populate 'currentList' array on scope with movie objects that include id, title, rating, poster and showtimes
         *       so that I can easily loop through in template
         * @param theaterId
         */
        var setMovieListPerTheater = function(theaterId){

            // found on SO
            function valuesToArray(obj) {
                return Object.keys(obj).map(function (key) { return obj[key]; });
            };

            for (var i=0, l=Theaters.length; i<l; i++) {
                if (Theaters[i].id == theaterId) {
                    // console.info(Object.keys(Theaters[i].showtimes)[1]);
                    // console.info(Theaters[i].showtimes);
                    // console.info(valuesToArray(Theaters[i].showtimes));
                    // console.info(valuesToArray(Theaters[i].showtimes).length);

                    var showtimesArr = valuesToArray(Theaters[i].showtimes);

                    for (var n=0, len=showtimesArr.length; n<len; n++) {
                        $scope.currentList.push({
                            id: Object.keys(Theaters[i].showtimes)[n],
                            title: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'title'),
                            rating: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'rating'),
                            poster: Movie.getAttrById(Movies, Object.keys(Theaters[i].showtimes)[n], 'poster'),
                            showtimes: showtimesArr[n].join(', ')
                        })

                    }
                }
            }
        };

        // These are convenience methods to set movie list for each theater
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

        /**
         * @desc read movie info (source: json) and fill 'Movies' array on $scope
         */
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
                // console.info('--- movie_metadata ---')
                // console.info(response.data);

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

        /**
         * @desc read theater info (source:json) and fill 'Theaters' array on $scope
         */
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
                // console.info('--- movie_metadata ---')
                // console.info(response.data);

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

        /**
         * @desc init function to group start actions: reading info from sources
         */
        var init = function(){
            getMoviesInfo();
            getTheatersInfo();
        };

        // initialize app
        init();

    }]
);