/**
 * Created by Vhagar on 8/29/2016.
 */
"USE STRICT";
scontableApp.factory("dbService", function($http){
    var sqlite = require('sqlite-sync');
    var db = sqlite.connect('data/scontable.db');
    return db;
});

scontableApp.factory('SessionService', function(){

    var userIsAuthenticated = false;


    return {
        setData: function (data) {
            userIsAuthenticated = data;
        },
        getData: function () {
            return userIsAuthenticated;
        }}

});


scontableApp.service('scopeService', function() {
    return {
        safeApply: function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && typeof fn === 'function') {
                    fn();
                }
            } else {
                $scope.$apply(fn);
            }
        },
    };
});









// Function to format date
function formatDate(value)
{
    return moment(value).format('YYYY/MM/DD');

}
// Function to encrypt password

function encrypt(text){
    var crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}


// Function to calculate Sum-of-Years' Digits Depreciation

function syd(cost, salvage, life, per)

{

    cost = parseFloat(cost);

    salvage = parseFloat(salvage);

    life = parseFloat(life);

    per = parseInt(per);

    if (( cost == 0 ) || ( life == 0 ) || (per == 0)){

        alert("Why do you want to test me with zeros?");

        return(0);

    }

    x = ((cost - salvage)*(life - per + 1))*2;

    syd_value = x / (life * (life+1));

    syd_value = conv_number(syd_value,2);

    return (syd_value);

}

// Function to calculate Straight-Line Depreciation of an Asset
function sln(cost, salvage, life)

{

    cost = parseFloat(cost);

    salvage = parseFloat(salvage);

    life = parseFloat(life);

    if (( cost == 0 ) || ( life == 0 )){

        alert("Why do you want to test me with zeros?");

        return(0);

    }

    x = cost - salvage;

    sln_value = x / life;

    sln_value = conv_number(sln_value,2);

    return (sln_value);

}


function conv_number(expr, decplaces)

{ // This function is from David Goodman's Javascript Bible.

    var str = "" + Math.round(eval(expr) * Math.pow(10,decplaces));

    while (str.length <= decplaces) {

        str = "0" + str;

    }

    var decpoint = str.length - decplaces;

    return (str.substring(0,decpoint) + "." + str.substring(decpoint,str.length));

}

// Function to calculate Depretiation based in a tax

function td(cost, tax, per)

{

    cost = parseFloat(cost);



    tax = parseFloat(tax);

    per = parseInt(per);

    if (( cost == 0 ) || (per == 0)){

        alert("Why do you want to test me with zeros?");

        return(0);

    }
    var costo=cost;

    for(var i = 0; i < per; i++) {

        syd_value=(costo*tax)/100;
        costo=costo-syd_value;

    }



    return (syd_value);

}



function uploadFIle(file,dir,name) {
    var fs = require('fs');
    var file = file;
    var source = fs.createReadStream(file.path);
    var dest;

// destination directory
    var dest_dir =process.cwd()+ dir;
    var filename = name;

    fs.readdir(dest_dir, function(err, dir_files) {
       /* for(var i = 0; i < dir_files.length; i++) {
            if(dir_files[i] == filename) {

                filename = name; // rename the file
                break;
            }
        }*/


        dest = fs.createWriteStream(dest_dir + '/' + filename);
        source.pipe(dest);
      


    });
    

    }

function deleteFile(dir) {
    var fs = require('fs');
    var dest_dir =process.cwd()+ dir;

    fs.exists(dest_dir, function(exists) {
        if(exists) {
            //Show in green
            console.log('File exists. Deleting now ...');
            fs.unlink(dest_dir);
        } else {
            //Show in red
            console.log('File not found, so not deleting.');
        }
    });
}

function datedyff(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

