/**
 * Created by Vhagar on 8/29/2016.
 */
scontableApp.controller("movieStubController", function ($scope, $location,SessionService) {
    $scope.headerSrc = "views/header.html";
    
    $scope.passwordSrc="views/login.html";
    $scope.SessionService = SessionService;

    $scope.calerts=function () {
        $scope.alerts=0;
    }


    $scope.isActive = function (route) {
        return route === $location.path();
    }

    $scope.isActivePath = function (route) {
        return ($location.path()).indexOf(route) >= 0;
    }

});
scontableApp.controller("clienteController", function($window,$timeout,$scope, $location, dbService){

    //Inicializando Componentes

    $('.dimmer').remove();

   
   $scope.venceEn=function (date) {

       var d1=new Date();

       var d2=new Date(date);

       var dif=datedyff(d2,d1,'days');

       if(dif>=0){
           return "Vencido";
       }
       else if(dif==-1){
           return "Vence en "+Math.abs(dif)+" día";
       }
       else{
           return "Vence en "+Math.abs(dif)+" dias";
       }

    }


    $scope.printInfo = function() {
        $window.print();
    };

    
  
    //--------------------------------------------------
    $scope.warningLevel = function (cliente) {
        var d1=new Date();

        var d2=new Date(cliente.fecha_vencimiento);

        var dif=datedyff(d2,d1,'days');

        if(dif>=0){
            return "red";
        }
        else{
            return "teal";
        }

    }
    
    $scope.sortType    = 'name';
    $scope.sortReverse  = false;
    $scope.listaClientes = function(){
        dbService.run("SELECT * FROM cliente", function(data){
            $scope.clientes = data;




        });

    }

    //Salvando
    $scope.salvar = function(){

    
        var rules = {
            fields: {
                name     : 'empty',
                telefono   : ['empty','number'],
                email : ['empty','email'],
                dir :  'empty',
                cuenta   : 'empty',
                codigo    : 'empty',
                date:'empty',
                date1:'empty'
            }
        };
        $('.ui.form.cliente').form(rules);
        if($('.ui.form.cliente').form('is valid')) {
            if ($scope.clienteForm.$invalid) {
                alert('Por favor inserte todos los datos requeridos');
            }

            else {
                $scope.cliente.fecha_firma=formatDate($scope.cliente.fecha_firma);
                $scope.cliente.fecha_vencimiento=formatDate($scope.cliente.fecha_vencimiento);


                if ($scope.cliente.id) {

                    //Editar

                    var id = $scope.cliente.id;
                    delete $scope.cliente.id;
                    delete $scope.cliente.$$hashKey; //Apaga elemento $$hashKey do objeto

                    dbService.update('cliente', $scope.cliente, {id: id}); //entidade, dados, where
                } else {

                    //nova

                    dbService.insert('cliente', $scope.cliente); // entidade, dados
                }
                $scope.cliente = {};
                $scope.listaClientes();
                $('#modalPessoa').modal('hide');
            }
        }
        else{
            $('.ui.form.cliente').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

    //Abrindo para editar
    $scope.editar = function(dados){

       
         if(dados)  {
        $scope.cliente = dados;
        $scope.cliente.fecha_firma= new Date($scope.cliente.fecha_firma);
        $scope.cliente.fecha_vencimiento= new Date($scope.cliente.fecha_vencimiento);}
        $('#modalPessoa').modal('show');
    }

    $scope.cerrar = function(){

        $('#modalPessoa').modal('hide');
        $scope.cliente = {};
        $scope.listaClientes();
    }

    //Excluindo
    $scope.excluir = function(dados){
        if(confirm("Desea realmente eliminar el cliente "+dados.nombre+"?")){
            
            dbService.delete('cliente', {id: dados.id});
            
            $scope.listaClientes();
        }
    }
});
scontableApp.controller("insumoController", function($scope, $location, dbService){

    $('.dimmer').remove();

    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    $scope.listaInsumos = function(){
        dbService.run("SELECT * FROM insumos", function(data){
            $scope.insumos = data;



        });
    }

    //Abrindo para editar
    $scope.editar = function(dados){


        if(dados)  {
            $scope.insumo = dados;

            $scope.insumo.f_compra= new Date($scope.insumo.f_compra);
        }

        $('#modalInsumo').modal('show');
    }
    $scope.cerrar = function(){

        $('#modalInsumo').modal('hide');
        $scope.insumo = {};
        $scope.listaInsumos();
    }

    //Excluindo
    $scope.excluir = function(dados){
        if(confirm("Desea realmente eliminar el Insumo "+dados.nombre+"?")){

            dbService.delete('insumos', {id: dados.id});

            $scope.listaInsumos();
        }
    }

    //Salvando
    $scope.salvar = function(){
        var rules = {
            fields: {
                nombre     : 'empty',


                precio : ['empty','number'],
                preciov:['empty','number']
            }
        };
        $('.ui.form.insumo').form(rules);
        if($('.ui.form.insumo').form('is valid')) {

            $scope.insumo.f_compra=formatDate($scope.insumo.f_compra);

                if ($scope.insumo.id) {

                    //Editar

                    var id = $scope.insumo.id;
                    delete $scope.insumo.id;
                    delete $scope.insumo.$$hashKey; //Apaga elemento $$hashKey do objeto

                    dbService.update('insumos', $scope.insumo, {id: id}); //entidade, dados, where
                } else {

                    //nova

                    dbService.insert('insumos', $scope.insumo); // entidade, dados
                }
                $scope.insumo = {};
                $scope.listaInsumos();
                $('#modalInsumo').modal('hide');

        }
        else{
            $('.ui.form.insumo').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }
});
scontableApp.controller("activosController", function($scope, $location, dbService){

    $('.dimmer').remove();
    
    $scope.sortType    = 'name';
    $scope.sortReverse  = false;
    $scope.listaActivos= function(){
        dbService.runAsync("SELECT id, nombre ,descripcion,f_compra,costo,codigo,t_depre,vida FROM activos WHERE tangible=1 ", function(data){
            $scope.activos = data;


        });

    }
    $scope.listaActivosI= function(){
        dbService.runAsync("SELECT id, nombre ,descripcion,f_compra,costo,codigo,t_depre,vida  FROM activos WHERE tangible=0 ", function(dat){
            $scope.activosintangibles = dat;


        });

    }
    $scope.calcsyd=function (data) {
        var periodo;
        var d1=new Date(data.f_compra);
        var d2= new Date();

        periodo = (d2.getFullYear() - d1.getFullYear()) +1;
        if(periodo>data.vida){
            $scope.warningLevel='negative';
            return '-';
        }
        else {
            $scope.warningLevel='';
            return td(data.costo, data.t_depre,periodo);
        }

    }
    $scope.editar = function(dados,tipo){

        if(dados)  {
            $scope.activo = dados;

            $scope.activo.f_compra= new Date($scope.activo.f_compra);
           }

        $scope.tangible=tipo;
        $('#modalActivo').modal('show');
    }
    $scope.cerrar = function(){

        $('#modalActivo').modal('hide');
        $scope.activo = {};
        $scope.listaActivos();
        $scope.listaActivosI();
    }

    $scope.excluir = function(dados){
        if(confirm("Desea realmente eliminar el activo "+dados.codigo+"?")){

            dbService.delete('activos', {id: dados.id});

            $scope.listaActivos()
            $scope.listaActivosI();
        }
    }

    $scope.salvar = function(){
        var rules = {
            fields: {
                codigo     : 'empty',
                costo   : ['empty','number'],
                rescate : ['empty','number'],
                nombre :  'empty',
                descripcion   : 'empty',
                fecha    : 'empty',
                vida:'empty'
                
            }
        };
        $('.ui.form.activo').form(rules);
        if($('.ui.form.activo').form('is valid')) {
           

            
                $scope.activo.f_compra=formatDate($scope.activo.f_compra);



                if ($scope.activo.id) {
                    //Editar
                    var id = $scope.activo.id;
                    delete $scope.activo.id;
                    delete $scope.activo.$$hashKey; //Apaga elemento $$hashKey do objeto


                    dbService.update('activos', $scope.activo, {id: id}); //entidade, dados, where
                } else {
                    //nova
                    $scope.activo.tangible=$scope.tangible;
                    dbService.insert('activos', $scope.activo); // entidade, dados
                }
                $scope.activo = {};
                $scope.listaActivos();
            $scope.listaActivosI();
                $('#modalActivo').modal('hide');
            
        }
        else{
            $('.ui.form.activo').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

});
scontableApp.controller("utilesController", function($scope, $location, dbService){

    $('.dimmer').remove();

    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    $scope.listaUtiles= function(){
        dbService.run("SELECT utiles.*,trabajador.nombre as name FROM utiles LEFT OUTER JOIN trabajador ON utiles.id_trabajador=trabajador.id ", function(data){
            $scope.utiles = data;


        });

    }

    $scope.editar = function(dados){
        dbService.run("SELECT id,nombre FROM trabajador WHERE activo='true' ", function(data){
            $scope.trabajadores = data;


        });
        if(dados)  {
            $scope.util = dados;
            delete $scope.util.name;
            $scope.util.f_compra= new Date($scope.util.f_compra);
            $scope.util.f_mant= new Date($scope.util.f_mant);
        }



        $('#modalUtil').modal('show');
    }
    $scope.cerrar = function(){

        $('#modalUtil').modal('hide');
        $scope.util = {};
        $scope.image = {};
        $scope.listaUtiles();
    }

    $scope.excluir = function(dados){
        if(confirm("Desea realmente eliminar la herramienta "+dados.codigo+"?")){


            dbService.delete('utiles', {id: dados.id});
            if(dados.foto!='null'&&dados.foto!='') {
                deleteFile(dados.foto);
            }
            $scope.listaUtiles();
        }
    }

    $scope.mantenimientoEn=function (date) {

        var d1=new Date();

        var d2=new Date(date);

        var dif=datedyff(d2,d1,'days');

        if(dif>=0){
            return "MANTENIMIENTO";
        }
        else if(dif==-1){
            return "Mantenimiento en "+Math.abs(dif)+" día";
        }
        else{
            return "Mantenimiento en "+Math.abs(dif)+" dias";
        }

    }






    //--------------------------------------------------
    $scope.warningLevel = function (date) {
        var d1=new Date();

        var d2=new Date(date);

        var dif=datedyff(d2,d1,'days');

        if(dif>=0){
            return "red";
        }
        else{
            return "teal";
        }

    }


    //Salvando
    $scope.salvar = function(){
        var rules = {
            fields: {
                nombre     : 'empty',
                codigo   : 'empty',
                costo : ['empty','number'],
                f_compra :  'empty',
                responsable   : 'empty',
                descripcion    : 'empty',
                f_mant:'empty'


            }
        };
        $('.ui.form.util').form(rules);
        if($('.ui.form.util').form('is valid')) {

            if ($scope.util.id) {

                //Editar


                $scope.util.f_compra=formatDate($scope.util.f_compra);
                $scope.util.f_mant=formatDate($scope.util.f_mant);

                var id = $scope.util.id;
                delete $scope.util.id;
                delete $scope.util.$$hashKey; //Apaga elemento $$hashKey do objeto

                dbService.update('utiles', $scope.util, {id: id}); //entidade, dados, where
                
                if(!angular.isUndefined($scope.image)&&!angular.isUndefined($scope.image.file)) {

                    var dir = '/media/herramientas';
                    var date= new Date();
                    var name = $scope.util.codigo+Math.random().toString(16)+'.png';

                    uploadFIle($scope.image.file, dir, name);
                    if($scope.util.foto!=null&&$scope.foto!=""){
                        deleteFile($scope.util.foto);
                        $scope.util.foto = dir+'/'+name;

                    }
                    else{
                        $scope.util.foto = dir+'/'+name;
                    }


                }

            } else {

                
                //nova
                if(!angular.isUndefined($scope.image)&&!angular.isUndefined($scope.image.file)) {
                    var dir = '/media/herramientas';

                    var name = $scope.util.codigo+Math.random().toString(16)+'.png';
                    
                    uploadFIle($scope.image.file, dir, name);

                    $scope.util.foto = dir+'/'+name;
                }
                $scope.util.f_compra=formatDate($scope.util.f_compra);
                $scope.util.f_mant=formatDate($scope.util.f_mant);

              dbService.insert('utiles', $scope.util); // entidade, dados
            }
            $scope.util = {};


            $('#modalUtil').modal('hide');
            $scope.listaUtiles();


            }

        else{
            $('.ui.form.util').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }
});
scontableApp.controller("trabajadorController", function($scope,$route, $location, dbService){
//Listando

    $('.dimmer').remove();
   

    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    $scope.vacaciones=function (datos) {
        var config;
        dbService.run("SELECT * FROM c_vacaciones LIMIT 1", function(data){
            config=data;

        });
        var result;
        var d1=new Date(datos.f_entrada);
        var d2= new Date();
        var months;

        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        result= months <= 0 ? 0 : months;

        return config[0].acumula_dias*Math.floor(result/config[0].cada);

    }

    $scope.aPagar=function (datos) {

        var money;
        var d1=moment().format('YYYY/MM/DD');
        var d2 = moment().format('YYYY/MM/01');

        dbService.run("SELECT SUM(ganancias) as pago,SUM(deduccion)as dedu FROM recibos_sueldo WHERE id_trabajador="+datos.id+" and fecha between '"+d2+"' and '"+d1+"'" , function(data){
            money=data[0];

        });

        return money.pago-money.dedu;

    }


    $scope.listaTrabajador = function(){
        dbService.runAsync("SELECT * FROM trabajador WHERE activo='true'", function(data){
            $scope.trabajadores = data;
            

        });
    }
    $scope.listaTrabajadorBaja = function(){
        dbService.runAsync("SELECT * FROM trabajador WHERE activo='false'", function(data){
            $scope.trabajadoresbaja = data;

        });
    }
    //Salvando
    $scope.salvar = function(){
        var rulesadd = {
            fields: {
                name : 'empty',

                f_entrada:'empty',
                telefono:'number',
                movil:'number'


            }
        };
        $('.ui.form.trabajador').form(rulesadd);
        if($('.ui.form.trabajador').form('is valid')) {



                $scope.trabajador.f_entrada=formatDate($scope.trabajador.f_entrada);

                if ($scope.trabajador.id) {


                    //Editar
                    var id = $scope.trabajador.id;
                    delete $scope.trabajador.id;
                    delete $scope.trabajador.$$hashKey; //Apaga elemento $$hashKey do objeto

                    dbService.update('trabajador', $scope.trabajador, {id: id}); //entidade, dados, where
                } else {

                    //nova
                    $scope.trabajador.activo=true;
                    dbService.insert('trabajador', $scope.trabajador); // entidade, dados
                }
                $scope.trabajador = {};
                $scope.listaTrabajador();
                $('#modalTrabajador').modal('hide');
            }

        else{
            $('.ui.form.trabajador').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

    //Abrindo para editar
    $scope.editar = function(dados){
        if(dados)  {
            $scope.trabajador = dados;

            $scope.trabajador.f_entrada= new Date($scope.trabajador.f_entrada);

        }



        $('#modalTrabajador').modal('show');
    }
    $scope.editarbaja = function(dados){



        $scope.trabajador = dados;
        $('#modalTrabajador').modal('show');
    }

    $scope.cerrar = function(){

        $('#modalTrabajador').modal('hide');
        $scope.trabajador = {};
        $scope.listaTrabajador();
    }
    //Excluindo
    $scope.delete = function(dados){
        if(confirm("Desea realmente eliminar el trabajador "+dados.nombre+"?")){
            dbService.delete('trabajador', {id: dados.id});
            $scope.listaTrabajadorBaja();

        }
    }
    $scope.showdarbaja=function (datos) {
        $scope.trabajador = datos;
        $('#modalDarBaja').modal('show');

    }
    $scope.cerrarbaja = function(){

        $('#modalDarBaja').modal('hide');
        $scope.trabajador = {};
    }
    $scope.darbaja=function (datos) {

        var rulesadd = {
            fields: {
                name     : 'empty',
                r_salida   : 'empty',
                f_salida:'empty',

            }
        };
        $('.ui.form.darbaja').form(rulesadd);
        if($('.ui.form.darbaja').form('is valid')) {
            $scope.trabajador.f_salida=formatDate($scope.trabajador.f_salida);
                if ($scope.trabajador.id) {


                    //Editar
                    var id = $scope.trabajador.id;
                    delete $scope.trabajador.id;
                    delete $scope.trabajador.$$hashKey; //Apaga elemento $$hashKey do objeto
                    $scope.trabajador.activo=false;
                   
                    dbService.update('trabajador', $scope.trabajador, {id: id}); //entidade, dados, where
                    dbService.update('utiles',{id_trabajador:''}, {id_trabajador:id}); //entidade, dados, where
                }
                $scope.trabajador = {};
            $scope.listaTrabajador();
                $scope.listaTrabajadorBaja();
                $('#modalDarBaja').modal('hide');

        }
        else{
            $('.ui.form.darbaja').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }

    }
    $scope.showHerramientas=function (datos) {


        $scope.herramientas = dbService.select('utiles',{id_trabajador:datos.id});
        if( $scope.herramientas[0]){
            $scope.trabajador = datos;
        $('#modalHerramientas').modal({
            observeChanges: true,

        }).modal('show').modal('refresh');

        }
        else{

            alert("El trabajador "+datos.nombre+" no tiene herramientas asignadas");
            $scope.trabajador = {};
        }

    }
    $scope.cerrarherra = function(){

        $('#modalHerramientas').modal('hide');



    }
});
scontableApp.controller("servicioController", function($window,$timeout,$scope, dbService){
    

    $('.dimmer').remove();

    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    $scope.GetTotalby=function (servicio) {
        var suma = servicio.mano_obra+servicio.total;


        if(servicio.deduccion==1){
            suma= suma+(suma*servicio.tasa_retencion/100);
        }

        if(servicio.redondear=='true'){
            suma = Math.round(suma)
        }

        return suma;

    }
    $scope.venceEn=function (servicio) {
        if(servicio.estado==1) {
            var d1 = new Date();

            var d2 = new Date(servicio.f_vencimiento);

            var dif = datedyff(d2, d1, 'days');

            if (dif >= 0) {
                return "Vencido";
            }
            else if (dif == -1) {
                return "Vence en " + Math.abs(dif) + " día";
            }
            else {
                return "Vence en " + Math.abs(dif) + " dias";
            }
        }
        else if(servicio.estado==0) {return "Sin fecha de vencimiento";}
        else {return "Pagado";}
    }

    $scope.warningLevel = function (servicio) {
       if(servicio.estado==1) {
           var d1 = new Date();

           var d2 = new Date(servicio.f_vencimiento);

           var dif = datedyff(d2, d1, 'days');

           if (dif >= 0) {
               return "red";
           }
           else {
               return "teal";
           }
       }
        else if(servicio.estado==0) {
           return "teal";
       }
        else{return "teal";}
    }
    $scope.Debe = function (servicio) {
        if(servicio.estado==-1) {
            return 0;
        }

        else{return $scope.GetTotalby(servicio);}
     }
    $scope.listaServicios = function(){
        dbService.runAsync("SELECT servicio.*,cliente.nombre ,total FROM servicio INNER JOIN cliente ON servicio.id_cliente=cliente.id LEFT OUTER JOIN (SELECT insumo_servicio.id_servicio,SUM(insumos.precio_venta*insumo_servicio.cant) as total  FROM insumos INNER JOIN insumo_servicio ON insumos.id=insumo_servicio.id_insumo) ON id_servicio=servicio.id", function(data){
            $scope.servicios = data;


        });
    }
    $scope.cerrar = function(){

        $('#modalFactura').modal('hide all');

        $timeout(function () {
            $('.deduccion').checkbox('uncheck');

        }, 0);
        $scope.factura = {};
        $scope.listaServicios();
    }
    $scope.editar = function(dados){


        //variables de control
        dbService.run("SELECT id,nombre FROM cliente", function(data){
            $scope.clientes = data;


        });
        dbService.run("SELECT * FROM insumos", function(data){
            $scope.insumos = data;


        });


        $scope.insumos_servicio=[

        ]



        if(dados)  {
            $scope.factura = dados;
            $timeout(function () {
                $('.dropdown.selection.cliente').dropdown('set selected', $scope.factura.id_cliente)
            }, 0);

            if($scope.factura.redondear=='true'){
                 $scope.factura.redondear=true;
             }
            if($scope.factura.tasa_retencion!=null && $scope.factura.tasa_retencion!=''){
                $timeout(function () {
                    $('.deduccion').checkbox('check');

                }, 0);

            }
            $scope.factura.fecha= new Date($scope.factura.fecha);
            if($scope.factura.f_vencimiento!=''){
                $scope.factura.f_vencimiento= new Date($scope.factura.f_vencimiento);
            }
            dbService.run("SELECT insumo_servicio.id,insumo_servicio.id_insumo,insumo_servicio.cant,insumo_servicio.id_servicio,insumos.nombre, insumos.precio_venta FROM insumo_servicio INNER JOIN insumos ON insumos.id=insumo_servicio.id_insumo WHERE id_servicio="+dados.id, function(data){
                $scope.insumos_servicio = data;


            });




        }
        else{
            $scope.factura.fecha= new Date();
        }

        $scope.addItem=function () {

            $('#modalInsumo')
                .modal('show')
            ;
            $('#modalFactura').modal('refresh');
        }
        $scope.add=function () {
            $('#modalInsumo')
                .modal('hide')
            ;

            if(!angular.isUndefined($scope.item.nombre)){



               var i= $scope.insumos_servicio.indexOf($scope.item);

               if(i>-1){

                   $scope.insumos_servicio[i] =$scope.item;
               }
                else{
                    var added=0;
                   angular.forEach($scope.insumos_servicio,function (element) {
                       if(element.id_insumo==$scope.item.id){
                           element.cant=$scope.item.cant;
                           added=1;

                       }
                   })
                      if(added==0){
                   $scope.insumos_servicio.push($scope.item);
                      }
               }




            }

            $('#modalFactura').modal('refresh');



        }
        $scope.removeItem = function(item) {
            if(item.id){
                dbService.delete('insumo_servicio', {id: item.id});
                $scope.insumos_servicio.splice($scope.insumos_servicio.indexOf(item), 1);
            }
            else{
                $scope.insumos_servicio.splice($scope.insumos_servicio.indexOf(item), 1);
            }

        };
        $scope.GetTotal=function () {
           var suma = $scope.factura.mano_obra;
            angular.forEach($scope.insumos_servicio, function(item){
                suma=suma+(item.cant*item.precio_venta);
            }
            )

            if($scope.factura.tasa_retencion){
                suma= suma+(suma*$scope.factura.tasa_retencion/100);
            }


           if($scope.factura.redondear==true){
               suma = Math.round(suma)
           }
            $('#modalFactura').modal('refresh');
          return suma;

        }




        $('.deduccion').checkbox().first().checkbox({
            onChecked: function() {

                $scope.factura.deduccion=1;
                $scope.$apply();
            },
            onUnchecked: function() {
                $scope.factura.deduccion=0;
                $scope.factura.retencion='';
                $scope.factura.tasa_retencion=0;
                $scope.$apply();
            }})
        ;

        $('.coupled.modal')
            .modal({
                allowMultiple: true
            })
        ;
        $('#modalInsumo')
            .modal('attach events', '#modalFactura .positive.button')
        ;
        $('#modalFactura')
            .modal('show')
        ;


    }

    //Salvando
    $scope.salvar = function(){
        var rules = {
            fields: {
                fecha     : 'empty',
                cliente : ['empty','number'],
                servicio :  'empty',
                tasa   : 'number'




            }
        };
        $('.ui.form.factura').form(rules);
        if($('.ui.form.factura').form('is valid')) {


            if ($scope.factura.id) {

                //Editar


                $scope.factura.fecha=formatDate($scope.factura.fecha);
                if(!$scope.factura.estado==-1) {
                    if (!moment.isDate($scope.factura.f_vencimiento)) {

                        $scope.factura.estado = 0;


                    }
                    else {

                        $scope.factura.f_vencimiento = formatDate($scope.factura.f_vencimiento);
                        $scope.factura.estado = 1;

                    }
                }
                var id = $scope.factura.id;
                delete $scope.factura.id;
                delete $scope.factura.$$hashKey; //Apaga elemento $$hashKey do objeto
                delete $scope.factura.nombre;
                delete $scope.factura.total;


                dbService.update('servicio', $scope.factura, {id: id}); //entidade, dados, where
                angular.forEach($scope.insumos_servicio, function(item){
                    if(item.id_servicio){
                        dbService.update('insumo_servicio', {cant:item.cant},{id:item.id});
                    }
                    else{
                        dbService.insert('insumo_servicio', {id_servicio:id,id_insumo:item.id,cant:item.cant});
                    }

                })


            }
            else {


                //nova

                delete $scope.factura.deduccion;

                $scope.factura.fecha=formatDate($scope.factura.fecha);

                if(!moment.isDate($scope.factura.f_vencimiento)){

                    $scope.factura.estado=0;

                }
                else{

                    $scope.factura.f_vencimiento=formatDate($scope.factura.f_vencimiento);
                    $scope.factura.estado=1;

                }
                var id;
              
                dbService.insert('servicio', $scope.factura, function(data){
                    id= data;


                }); // entidade, dados



                angular.forEach($scope.insumos_servicio, function(item){
                    
                    dbService.insert('insumo_servicio', {id_servicio:id,id_insumo:item.id,cant:item.cant});
                    }
                )

            }
            $scope.factura = {};
            $scope.insumos_servicio=[];

            $timeout(function () {
              $('.deduccion').checkbox('uncheck');

            }, 0);
            $('#modalFactura').modal('hide');
            $scope.listaServicios();


        }

        else{
            $('.ui.form.factura').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }


    $scope.pagar= function (fact) {


        $('#modalPagada').modal('toggle');
        $('#modalPagada').modal('refresh');
        $scope.pagadoid=fact.id;


    }
    $scope.pagado = function () {
        if(!angular.isUndefined($scope.image)&&!angular.isUndefined($scope.image.file)) {
            var dir = '/media/facturas';

            var name = $scope.pagadoid+Math.random().toString(16)+'.png';

            uploadFIle($scope.image.file, dir, name);

            var archivo = dir+'/'+name;
            dbService.update('servicio', {estado:-1},{id:$scope.pagadoid});
            dbService.insert('facturas', {id_servicio:$scope.pagadoid,archivo:archivo});
            $('#modalPagada').modal('toggle');
            $scope.listaServicios();
            delete $scope.image;
        }
        else{
            $('#modalPagada').modal('toggle');
            alert("Por favor debe seleccionar una copia de la factura")

        }
    }
    $scope.seeScan=function (fact) {

        dbService.run("SELECT archivo from facturas WHERE id_servicio="+fact.id,function(data){
            $scope.archivo = data[0];


        });
        $window.ScopeToShare = $scope.archivo;

        $window.open('../views/models/index.html');

    }
    $scope.see = function(dados){

        $scope.datos=[];
        $scope.datos.factura=dados;



        dbService.run("SELECT * FROM cliente WHERE id="+dados.id_cliente, function(data){
            $scope.datos.cliente = data[0];


        });
        dbService.run("SELECT * FROM c_company", function(data){
            $scope.datos.company = data[0];


        });
        $scope.datos.total=$scope.GetTotalby(dados);
        $window.ScopeToShare = $scope.datos;
        

        $window.open('../views/models/factura.html');

    }


});
scontableApp.controller("recibosController", function($scope,$window, $location,$timeout ,dbService){

    $('.dimmer').remove();




    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    
    $scope.listaComprobantes = function(){
        dbService.runAsync("SELECT recibos_sueldo.*,recibos_sueldo.ganancias-recibos_sueldo.deduccion as pneto,trabajador.nombre FROM recibos_sueldo INNER JOIN trabajador ON recibos_sueldo.id_trabajador=trabajador.id", function(data){
            $scope.recibos = data;


        });
    }




    $scope.cerrar = function(){

        $('#modalComprobante').modal('hide');
        $scope.comprobante = {};
        $timeout(function () {
            $('.checkbox.deduccion').checkbox('toggle');
        }, 0);
        $scope.s_social =0;
        $scope.listaComprobantes();
    }


    $scope.editar = function(dados){

        $scope.s_social=0;
        

        dbService.run("SELECT id,nombre FROM trabajador WHERE activo='true' ", function(data){
            $scope.trabajadores = data;


        });
        $('.checkbox.deduccion')
            .checkbox()
            .first().checkbox({
            onChecked: function() {
                dbService.run("SELECT * FROM deducciones WHERE id='1'", function(data){
                    $scope.s_social =data[0].taza;
                    $scope.$apply();

                });

            },
            onUnchecked: function() {
                    $scope.s_social =0;
                    $scope.$apply();
            }
        });


        if(dados)  {
            $scope.comprobante = dados;

            $scope.comprobante.fecha= new Date($scope.comprobante.fecha);
            if($scope.comprobante.deduccion>0){
                $timeout(function () {
                    $('.checkbox.deduccion').checkbox('check');
                }, 0);

            }

        }





        $('#modalComprobante').modal('show');
    }

    $scope.see = function(dados){

        $scope.datos=[];
        $scope.datos.comprobante=dados;



        dbService.run("SELECT * FROM trabajador WHERE activo='true'and id="+dados.id_trabajador, function(data){
            $scope.datos.trabajador = data[0];


        });
        dbService.run("SELECT * FROM c_company", function(data){
            $scope.datos.company = data[0];


        });
        $window.ScopeToShare = $scope.datos;

        $window.open('../views/models/comprobante.html');

    }
    $scope.salvar = function(){
        var rulesadd = {
            fields: {
                fecha     : 'empty',

                empleado:'empty',
                ganancias:['number','empty'],
                movil:'number'


            }
        };
        $('.ui.form.comprobante').form(rulesadd);
        if($('.ui.form.comprobante').form('is valid')) {



                $scope.comprobante.fecha=formatDate($scope.comprobante.fecha);

                if ($scope.comprobante.id) {


                    //Editar
                    var id = $scope.comprobante.id;
                    delete $scope.comprobante.id;
                    delete $scope.comprobante.$$hashKey; //Apaga elemento $$hashKey do objeto
                    delete $scope.comprobante.nombre;
                    delete $scope.comprobante.pneto;
                    $scope.comprobante.deduccion=$scope.comprobante.ganancias*$scope.s_social/100;

                    dbService.update('recibos_sueldo', $scope.comprobante, {id: id}); //entidade, dados, where
                } else {

                   $scope.comprobante.deduccion=$scope.comprobante.ganancias*$scope.s_social/100;
                    dbService.insert('recibos_sueldo', $scope.comprobante); // entidade, dados
                }
                $scope.comprobante = {};
                $scope.listaComprobantes();
                $('#modalComprobante').modal('hide');
            }

        else{
            $('.ui.form.comprobante').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

});
scontableApp.controller("ajustesController", function($scope, $location, dbService){

});
scontableApp.controller("WelcomeCtrl", function($scope, $location, dbService,SessionService){
    $scope.SessionService = SessionService;

    $scope.listaCuentas = function(){
        dbService.runAsync("SELECT * FROM c_cuentas WHERE tipo='0'", function(data){
            $scope.cuentasgastos = data;


        });
        dbService.runAsync("SELECT * FROM c_cuentas WHERE tipo='1'", function(data){
            $scope.cuentasventas = data;


        });
    }
    $scope.Money=function (cuenta) {
        
    }
});
scontableApp.controller("loginControllers", function($scope, $location, dbService,SessionService){

//Salvando
    $scope.entrar = function(){
        var rulesadd = {
            fields: {
                username     : 'empty',

                password:'empty'


            }
        };
        $('.ui.form.login').form(rulesadd);
        if($('.ui.form.login').form('is valid')) {
            
            var usuario;
            dbService.run("SELECT * FROM c_user LIMIT 1", function(data){
                usuario = data[0];



            });
            if(usuario.name==$scope.name && decrypt(usuario.password)==$scope.password) {
                SessionService.setData(true);
                $location.path("/welcome");
            }
            else{
                alert("Usuario o contraseña incorrectos!");
            }

        }
        else{
            $('.ui.form.login').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

});
scontableApp.controller("asientosController", function($scope, $location, dbService,$timeout){

    $scope.sortType    = 'name';
    $scope.sortReverse  = false;

    $scope.listaAsientos = function(){
        dbService.runAsync("SELECT * FROM asientos", function(data){
            $scope.asientos = data;


        });
    }
    $scope.editar = function(dados){
        dbService.runAsync("SELECT * FROM c_cuentas", function(data){
            $scope.cuentas = data;


        });
        $scope.asiento=[];
        if(dados)  {
            $scope.asiento = dados;
            $scope.asiento.fecha= new Date($scope.asiento.fecha);
            $timeout(function () {
                $('.dropdown.selection.cuenta').dropdown('set selected', $scope.asiento.id_cuenta)
            }, 0);

        }
        else{

            $scope.asiento.fecha = new Date();
        }



        $('#modalAsiento').modal('show');
    }
    $scope.cerrar = function(){

        $('#modalAsiento').modal('hide');
        $scope.asiento = {};
        $scope.listaAsientos();
    }
    //Salvando
    $scope.salvar = function(){
        var rulesadd = {
            fields: {
                cuenta : 'empty',

                fecha:'empty',
                costo:['number','empty']
               


            }
        };
        $('.ui.form.asiento').form(rulesadd);
        if($('.ui.form.asiento').form('is valid')) {



            $scope.asiento.fecha=formatDate($scope.asiento.fecha);

            if ($scope.asiento.id) {


                //Editar
                var id = $scope.asiento.id;
                delete $scope.asiento.id;
                delete $scope.asiento.$$hashKey; //Apaga elemento $$hashKey do objeto

                dbService.update('asientos', $scope.asiento, {id: id}); //entidade, dados, where
            } else {

                //nova

                dbService.insert('asientos', $scope.asiento); // entidade, dados
            }
            $scope.asiento = {};
            $scope.listaAsientos();
            $('#modalAsiento').modal('hide');
        }

        else{
            $('.ui.form.asiento').form('validate form');
            //Next line is for test only
            //StepsService.steps('SingInFlow').next();
        }
    }

   
});