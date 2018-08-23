/**
 * Created by Vhagar on 8/29/2016.
 */
window.routes =
{
    "/welcome": {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl',
        requireLogin: false
    },
    "/login": {
        templateUrl: 'views/login.html',
        controller: 'loginControllers',
        requireLogin: false
    },
    "/insumos": {
        templateUrl: 'views/insumos.html',
        controller: 'insumoController',
        requireLogin: true
    },
    "/activos": {
        templateUrl: 'views/activos.html',
        controller: 'activosController',
        requireLogin: true
    },
    "/trabajador": {
        templateUrl: 'views/trabajador.html',
        controller: 'trabajadorController',
        requireLogin: true
    },
    
    "/ajustes": {
        templateUrl: 'views/ajustes.html',
        controller: 'ajustesController',
        requireLogin: true
    },
    "/factura": {
        templateUrl: 'views/servicios.html',
        controller: 'servicioController',
        requireLogin: true
    },
    "/utiles": {
    templateUrl: 'views/utiles.html',
    controller: 'utilesController',
    requireLogin: true
    },
    "/clientes": {
        templateUrl: 'views/cliente.html',
        controller: 'clienteController',
        requireLogin: true
    },
    "/recibos": {
        templateUrl: 'views/recibos_sueldos.html',
        controller: 'recibosController',
        requireLogin: true
    }
    ,
    "/asientos": {
        templateUrl: 'views/asientos.html',
        controller: 'asientosController',
        requireLogin: true
    }
};


scontableApp.config(['$routeProvider', function($routeProvider){

    //this loads up our routes dynamically from the previous object 
    for(var path in window.routes) {
        $routeProvider.when(path, window.routes[path]);
    }

    $routeProvider.otherwise({redirectTo: '/welcome'});

}]).run(function($route,$rootScope,SessionService){

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        for(var i in window.routes) {
            if(next.indexOf(i) != -1) {

                if(window.routes[i].requireLogin && !SessionService.getData()) {
                    alert("You need to be authenticated to see this page!");
                    event.preventDefault();
                }
                
            }
        }
    });

});