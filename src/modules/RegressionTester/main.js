function RegressionTester(tgtFn, prevVers){
	// create this alias me
	me = this;
	this.those = [];
	this.argStor = [];
	this.resultDiff = [];

	function init(){
		if (tgtFn) registerTgt(tgtFn);
		if (prevVers) registerPrev(prevVers);
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

	function registerPrev(prevVers){
		return (this.prevFn = prevVers);
	}

	init();
}

module.exports = RegressionTester;