function RegressionTester(tgtFn, prevVers){
	this.those = [];
	this.argStor = [];
	this.resultDiff = [];
	this.wrappedTgt;
	// create this alias me
	me = this;

	function init(){
		if (tgtFn) registerTgt(tgtFn);
		if (prevVers) registerPrev(prevVers);
		console.log('initialized!');
		console.log(me);
		Object.assign(me,{
			runTest:runTest,
			retisterTgt:registerTgt,
			registerPrev:registerPrev
		});
	}

	// Private Methods
	function registerTgt(tgtFn){
		// save old version of function
		me.tgtFn = tgtFn;
		// wrap function with redirect to storeArgs
		me.wrappedTgt = function(){
			window.setTimeout(storeArgs(this,arguments));
			return me.tgtFn.apply(this,arguments);
		};
		return me.tgtFn;
	}

	function registerPrev(prevVers){
		return (me.prevVers = prevVers);
	}

	function runTest(argList){
		if(argList && argList.length===me.argStor.length){
			tgtRes = me.tgtFn.apply(this,argList);
			prevRes = me.prevVers.apply(this,argList);
			if (tgtRes!=prevRes){me.resultDiff.push({this:this,args:argList,tgtRes:tgtRes,prevRes:prevRes});}
		} else window.setTimeout(runTestAux);
	}

	function runTestAux(){
		me.those.forEach(function(that){runTestRecurse.call(that,[]);});
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
		if (!me.those.includes(args[i]))me.those.push(args[i]);
		for(var i=0;i<args.length;i++){
			if (me.argStor[i]===undefined)me.argStor[i]=[];
			if (!me.argStor[i].includes(args[i]))me.argStor[i].push(args[i]);
		}
	}

	init();
}

module.exports = RegressionTester;