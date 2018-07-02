(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function main(){

    function initialize(){
        registerHelper();
        loadFiles();
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

    function loadFiles(){
        window.zsHelper.testPropGetType = require('./modules/regressionTester/main.js');
    }

    initialize();

})();
},{"./modules/regressionTester/main.js":2}],2:[function(require,module,exports){
function RegressionTester(tgtFn, prevVers){
	this.those = [];
	this.argStor = [];
	this.resultDiff = [];
	this.tgtFn={};
	this.prevVers={};
	// create this alias me
	me = this;

	function init(){
		if (tgtFn) registerTgt(tgtFn);
		if (prevVers) registerPrev(prevVers);
		console.log('initialized!');
		console.log(this);
	}

	// Private Methods
	function registerTgt(tgtFn){
		// save old version of function
		this.tgtFn = tgtFn;
		// wrap function with redirect to storeArgs
		tgtFn = function(){
			window.setTimeout(storeArgs(this,arguments));
			return me.tgtFn.apply(this,arguments);
		};
		return this.tgtFn;
	}

	function registerPrev(prevVers){
		return (this.prevVers = prevVers);
	}

	function runTest(argList){
		if(argList && argList.length===me.argStor.length){
			tgtRes = me.tgtFn.apply(this,argList);
			prevRes = me.prevVers.apply(this,argList);
			if (tgtRes!=prevRes){me.resultDiff.push({this:this,args:argList,tgtRes:tgtRes,prevRes:prevRes});}
		} else window.timeout(runTestAux);
	}

	function runTestAux(){
		this.those.forEach(function(that){runTestRecurse.call(that,[]);});
	}

	function runTestRecurse(argList){
		if(!argList)argList=[];
		if(argList.length<me.argStor.length){
			me.argStor[argNum].forEach(function(val){
				runTestRecurse.call(this,argList.concat([val]));
			});
		}else runTest.call(this,argList);
	}

	function storeArgs(that,args){
		if (!this.those.includes(args[i]))this.those.push(args[i]);
		for(var i=0;i<args.length;i++){
			if (this.argStor[0]===undefined)this.argStor[0]=[];
			if (!this.argStor[0].includes(args[i]))this.argStor[i].push(args[i]);
		}
	}

	init();
}

module.exports = RegressionTester;
},{}]},{},[1]);
