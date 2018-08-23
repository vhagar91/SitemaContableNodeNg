angular.module('invoicing', [])

.directive('localSrc', [function () {
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
}])

// Main application controller
.controller('InvoiceCtrl', ['$scope','$window',
  function($scope,$window) {

  // Set defaults
  $scope.currencySymbol = '$';
  $scope.logoRemoved = false;
  $scope.printMode   = true;
  $scope.date   = new Date();

      (function init() {
          // Attempt to load invoice from local storage
          if($window.parent != null)
          {
              $scope.datos = $window.opener.ScopeToShare;

          }
         $scope.datos.factura.fecha=moment($scope.datos.factura.fecha).format('DD-MMMM-YYYY');
         $scope.logo=$scope.datos.company.logo;


      })()

  $scope.toggleLogo = function(element) {
          $scope.logoRemoved = !$scope.logoRemoved;

      };

      // Triggers the logo chooser click event
      $scope.editLogo = function() {
          // angular.element('#imgInp').trigger('click');
          document.getElementById('imgInp').click();
      };

      
  $scope.printInfo = function() {
    window.print();

  };

      var readUrl = function(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = function (e) {

                  $scope.logo= e.target.result;
                  $scope.$apply();
              }
              reader.readAsDataURL(input.files[0]);
          }
      };
      // Runs on document.ready
      angular.element(document).ready(function () {

          // Changes the logo whenever the input changes
          document.getElementById('imgInp').onchange = function() {
              readUrl(this);
          };
      });


}])
.controller('comprobanteCtrl', ['$scope','$window', '$http',
      function($scope,$window, $http) {

        // Set defaults
        $scope.currencySymbol = '$';



        (function init() {
          // Attempt to load invoice from local storage
          if($window.parent != null)
          {
            $scope.datos = $window.opener.ScopeToShare;

          }
          $scope.datos.comprobante.fecha=moment($scope.datos.comprobante.fecha).format('DD-MMMM-YYYY');

        })()


        $scope.printInfo = function() {
          $window.print();
        };

       



        

      }])
.controller('scanCtrl', ['$scope','$window', '$http',
        function($scope,$window, $http) {

            // Set defaults
         (function init() {
                // Attempt to load invoice from local storage
                if($window.parent != null)
                {
                    $scope.foto = $window.opener.ScopeToShare;

                }


            })()


            $scope.printInfo = function() {
                $window.print();
            };







        }])