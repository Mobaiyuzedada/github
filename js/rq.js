;(function (){
'use strict';



    window.$={
        get,
    }

    function get(url,onSuccess){
        send('get',url,onSuccess);
    }

    function send(method,url,onSuccess,onError){
        let http=new XMLHttpRequest();
        http.open(method,url);
        http.send();

        http.addEventListener('load',data=>{
            data=JSON.parse(http.responseText);
            onSuccess && onSuccess(data);
        })
    }
})();