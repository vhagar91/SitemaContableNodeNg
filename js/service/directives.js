/**
 * Created by Vhagar on 8/31/2016.
 */
scontableApp.directive('dropdown', function ($timeout) {
    return {
        restrict: "C",
        link: function (scope, elm, attr) {
            $timeout(function () {
                $(elm).dropdown({
                    on: 'hover'
                }).dropdown('setting', {

                   /* onChange: function (value) {
                        scope.$parent[attr.ngModel] = value;
                        scope.$parent.$apply();
                    },*/

                });
            }, 0);
        }
    };
});



scontableApp.directive('basecheckbox', function ($timeout) {
    return {
        restrict: "C",
        link: function (scope, elm, attr) {
            $timeout(function () {
                $(elm).checkbox({

                })
            }, 0);
        }
    };
});

scontableApp.directive('popup', function ($timeout) {
    return {
        restrict: "C",
        link: function (scope, elm, attr) {
            $timeout(function () {
                $(elm).popup({
                    position : 'top center',
                })
            }, 0);
        }
    };
});


scontableApp.directive('localSrc', [function () {
    return {
        link: function ($scope, elem, attrs) {
            function revokeObjectURL() {
                if ($scope.objectURL) {
                    URL.revokeObjectURL($scope.objectURL);
                }
            }

            $scope.$watch('objectURL', function (objectURL) {
                elem.attr('src', objectURL);
            });

            $scope.$on('$destroy', function () {
                revokeObjectURL();
            });

            attrs.$observe('localSrc', function (url) {
                revokeObjectURL();

                if(url!='null'&&url!='') {
                    $scope.objectURL = url;
                }
                else {
                    $scope.objectURL = "../media/assets/images/wireframe/image.png"
                }
            });
        }
    };
}]);


scontableApp.directive('image', function($q) {
    'use strict'

    var URL = window.URL || window.webkitURL;

    var getResizeArea = function () {
        var resizeAreaId = 'fileupload-resize-area';

        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
            resizeArea = document.createElement('canvas');
            resizeArea.id = resizeAreaId;
            resizeArea.style.visibility = 'hidden';
            document.body.appendChild(resizeArea);
        }

        return resizeArea;
    }

    var resizeImage = function (origImage, options) {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';

        var canvas = getResizeArea();

        var height = origImage.height;
        var width = origImage.width;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height *= maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width *= maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        //draw image on canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(origImage, 0, 0, width, height);

        // get the data from canvas as 70% jpg (or specified type).
        return canvas.toDataURL(type, quality);
    };

    var createImage = function(url, callback) {
        var image = new Image();
        image.onload = function() {
            callback(image);
        };
        image.src = url;
    };

    var fileToDataURL = function (file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    };


    return {
        restrict: 'A',
        scope: {
            image: '=',
            resizeMaxHeight: '@?',
            resizeMaxWidth: '@?',
            resizeQuality: '@?',
            resizeType: '@?',
        },
        link: function postLink(scope, element, attrs, ctrl) {

            var doResizing = function(imageResult, callback) {
                createImage(imageResult.url, function(image) {
                    var dataURL = resizeImage(image, scope);
                    imageResult.resized = {
                        dataURL: dataURL,
                        type: dataURL.match(/:(.+\/.+);/)[1],
                    };
                    callback(imageResult);
                });
            };

            var applyScope = function(imageResult) {
                scope.$apply(function() {
                    //console.log(imageResult);
                    if(attrs.multiple)
                        scope.image.push(imageResult);
                    else
                        scope.image = imageResult;
                });
            };


            element.bind('change', function (evt) {
                //when multiple always return an array of images
                if(attrs.multiple)
                    scope.image = [];

                var files = evt.target.files;
                for(var i = 0; i < files.length; i++) {
                    //create a result object for each file in files
                    var imageResult = {
                        file: files[i],
                        url: URL.createObjectURL(files[i])
                    };

                    fileToDataURL(files[i]).then(function (dataURL) {
                        imageResult.dataURL = dataURL;
                    });

                    if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                        doResizing(imageResult, function(imageResult) {
                            applyScope(imageResult);
                        });
                    }
                    else { //no resizing
                        applyScope(imageResult);
                    }
                }
            });
        }
    };
});


scontableApp.directive('daterangepciker', function() {
    return {
        restrict: 'E',
        replace: true,
        template: "<div id='reportrange2' class='ui button'style='display: inline-block; background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc'><i class='calendar icon'></i><span></span> <i class='chevron down icon' style='margin:0'></i></div>",
       
        link: function($scope, element, attrs) {

            $('#reportrange2 span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
            $('#reportrange2').daterangepicker({
                    opens: 'left'
                },
                function(start, end) {
                    $('#reportrange2 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

                    $scope.start=start;
                    $scope.end=end;
                    
                    $scope.$apply();
                    


                }
            );
            
        }
    }
});

//export html table to pdf, excel and doc format directive

