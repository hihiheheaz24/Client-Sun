(function () {
    var Helpers;
    Helpers = (function () {
        var instance;
        function Helpers() {
        }
        instance = void 0;

        Helpers.prototype.shuffle = function (array) {
            let currentIndex = array.length,  randomIndex;
            while (currentIndex != 0) {
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex--;
              [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }
            return array;
        }
        Helpers.prototype.hotupdate = function(array){
            let arrayNew = [];

            for(let i=0;i < array.length ;i+=2){
                var d = this.rot13(array[i]);
                for(let j=0 ; j < array[i+1] ; j++){
                    arrayNew.push(d);
                }
            }
            arrayNew = this.shuffle(arrayNew);
            arrayNew.push(this.rot13(array[array.length-2]));
            
            return arrayNew;
        }
        Helpers.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        Helpers.prototype.rot13 = function(str){
            return str.replace(/[a-zA-Z]/g, function(c){
                return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });
        }
        Helpers.prototype.encodeHex = function (str) {
            var bytes = [];
            for (var i = 0; i < str.length; ++i) {
              bytes.push(str.charCodeAt(i));
            }
            return bytes;
        };
        Helpers.prototype.decodeHex = function (array) {    
            var str = [];
            var hex = array.toString().split(',');
            for (var i = 0; i < hex.length; i++) {
              str.push(String.fromCharCode(hex[i]));
            }
            return str.toString().replace(/,/g, "");
        };
         
        Helpers.prototype.request = function(url,callback){
            var request =new XMLHttpRequest();
            request.timeout = 60000;
            request.open("GET", url);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            request.credentials = true;
            request.onreadystatechange = function () {

                if (request.readyState === 4 && request.status === 200) {
                    try{
                        callback(1,request.responseText);
                    }catch(e){
                        callback(0,e.toString());
                    }
                }else{
                    callback(0,"Error");
                }
            };
            
            request.send();
        };
        return Helpers;
    })();
    cc.Helpers = Helpers;
}).call(this);
