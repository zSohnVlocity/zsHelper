(function main(){

    function initialize(){
        registerHelper();
        loadThirdPartyHelpers();
    }

    function registerHelper(){
        window.zsHelper = {
            decodeAngularError:decodeAngularError
        };
    }

    function loadThirdPartyHelpers(){}

    function parseURL(input){
        //for now we're mostly dealing with module errs this might have to be modified for other error patterns
        var tmp=/^(.*?)([^/]*)$/.exec(input)
        var root=tmp[1];
        var stem=tmp[2];

        tmp =/^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(stem);
        var name=tmp[1];
        var query={$raw:tmp[2]&&tmp[2].substr(1)};
        var hash=tmp[3]&&tmp[3].substr(1);

        query.$raw&&query.$raw.split('&').forEach(function(param){
            var tmp=param.split('=');
            query[tmp[0]]=tmp[1];
        });
        return {
            root:root,
            stem:{
                $raw:stem,
                name:name,
                query:query,
                hash:hash
            }
        };
    }

    function decodeAngularError(input){
        input=input||window.location.href;
        var links = [];
        decodeAngularErrorAux(input,links);
        return links;
    }

    function decodeAngularErrorAux(input,links){
        var parsed=parseURL(input);
        var link,tmp;
        if(parsed.stem.query.p1){
            links.push(parsed.root+parsed.stem.name+'?p0='+parsed.stem.query.p0);
            link=decodeURIComponent(parsed.stem.query.p1).split(/\s+/)[2];
            if(decodeAngularErrorAux(link,links)){
                links.push(decodeURIComponent(parseURL(input).stem.query.p1));
            }
        } else return true;
    }

    initialize();

})();