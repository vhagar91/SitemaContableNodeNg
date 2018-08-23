/**
 * Created by Vhagar on 9/13/2016.
 */
scontableApp.filter('sumFilter', function(dbService) {
    return function(groups) {
        var Totals = 0;
        var d1=moment().format('YYYY/MM/DD');
        var d2 = moment().format('YYYY/MM/01');
        for (i=0; i<groups.length; i++) {

            var money;
            dbService.run("SELECT SUM(ganancias) as pago,SUM(deduccion)as dedu FROM recibos_sueldo WHERE id_trabajador="+groups[i].id+" and fecha between '"+d2+"' and '"+d1+"'", function(data){
                money=data[0];

            });

            Totals = Totals + (money.pago-money.dedu);
        };
        return Totals;
    };
});

scontableApp.filter('daterange', function ()
{
    return function(querry, start_date, end_date,model)
    {
        var result = [];



        if (angular.isArray(querry) && querry.length > 0 && start_date && end_date)
        {


            var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
            var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();


            angular.forEach(querry, function(item) {

                switch (model){
                    case 'cliente':
                        var itemDate = new Date(item.fecha_firma);
                        if (itemDate >= start_date && itemDate <= end_date)
                        {

                            result.push(item);

                        }
                        break;

                    case 'trabajador':
                        var itemDate = new Date(item.f_entrada);
                        if (itemDate >= start_date && itemDate <= end_date)
                        {

                            result.push(item);

                        }
                        break;

                    case 'activo':
                        var itemDate = new Date(item.f_compra);

                        if (itemDate >= start_date && itemDate <= end_date)
                        {

                           result.push(item);

                        }
                        break;

                    case 'util':
                        var itemDate = new Date(item.f_compra);
                        if (itemDate >= start_date && itemDate <= end_date)
                        {

                          
                            result.push(item);

                        }
                        break;
                    case 'comprobante':
                        var itemDate = new Date(item.fecha);
                        if (itemDate >= start_date && itemDate <= end_date)
                        {


                            result.push(item);

                        }
                        break;




                    default: return querry;

                }
            });


            return result;


        }
        else {

            return querry;
        }
    };
});

