class Coreta{
	constructor(){
		this._started = false;
		this.reset();
	}
	reset(){
		this.actions ={
			size:0,
			data :[]
		};
		this.periods = {
			size:0,
			data:[]
		};
		this.criterias = {
			size:0,
			data:[]
		};
		this.lamdas = {
			global:null,
			data:[]
		};
		this.data = [];
		this._normalized = false;
	}
	restore(){
		const store = localStorage.getItem('lastCoreta');
		if(store){
			const obj = JSON.parse(store);
			this.actions = obj.actions;
			this.periods = obj.periods;
			this.criterias = obj.criterias;
			this.data = obj.data;
			this.lamdas = obj.lamdas ||{
				global:null,
				data:[]
			};
			this._normalized = false;
			return true;
		}else{
			return false;
		}
	}
	save(){
		localStorage.setItem("lastCoreta", JSON.stringify({
			actions : this.actions ,
			periods : this.periods,
			criterias : this.criterias ,
			data : this.data,
			lamdas:this.lamdas
		}));
		this._started = false;
	}
	get hasStorage(){
		return localStorage.getItem('lastCoreta')!==null;
	}
	get started(){
		return this._started;
	}
	round(x, i=5){
		return Math.round(x*Math.pow(10,i))/Math.pow(10,i);
	}
	setSize(period, action, criteria){
		if(period<2||action<2||criteria<2) return false;
		this.periods.size = parseInt(period);
		this.criterias.size = parseInt(criteria);
		this.actions.size = parseInt(action);
		this.periods.data = [];
		this.criterias.data = [];
		this.actions.data = [];
		for (let pI = 0; pI < this.periods.size; pI++) {
			this.data[pI]=[];
			for (let oI = 0; oI < this.actions.size; oI++) {
				this.data[pI][oI] = Array(this.criterias.size).fill(null);
			}
		}
		this._started = true;
		return true;
	}
	
	getActionSize(){
		return this.actions.size;
	}
	addActionAttributes(name){
		if(name.length<3) return false;
		for (const action of this.actions.data) {
			if(action.name === name){
				return false;
			}
		}
		this._started = true;
		this.actions.data.push({name});
		return true;
	}
	actionAttributesIsSet(){
		return this.actions.data.length >= this.actions.size;
	}
	getActionAttributes(idx){
		return this.actions.data[idx];
	}
	setActionAttributes(idx, name){
		if(this.actions.data[idx].name!==name){
			if(name.length<3) return false;
			for (const action of this.actions.data) {
				if(action.name === name){
					return false;
				}
			}
		}
		this._started = true;
		this.actions.data[idx] = {name};
		return true;
	}
	getActionsAttributes(){
		return this.actions.data.slice();
	}
	
	getPeriodSize(){
		return this.periods.size;
	}
	addPeriodAttributes(name, weight){
		if(name.length<3 || weight==="" || isNaN(weight)) return false;
		weight = parseFloat(weight);
		for (const period of this.periods.data) {
			if(name === period.name){
				return false;
			}
		}
		this._started = true;
		this.periods.data.push({name,weight});
		return true;
	}
	periodAttributesIsSet(){
		return this.periods.data.length >= this.periods.size;
	}
	getPeriodAttributes(idx){
		return this.periods.data[idx];
	}
	setPeriodAttributes(idx, name, weight){
		if(name.length<3 || weight==="" || isNaN(weight)) return false;
		weight = parseFloat(weight);
		if(this.periods.data[idx].name!==name){
			for (const period of this.periods.data) {
				if(name === period.name){
					return false;
				}
			}
		}
		this._started = true;
		this.periods.data[idx] = {name,weight};
		return true;
	}
	getPeriodsAttributes(){
		return this.periods.data.slice();
	}
	
	getCriteriaSize(){
		return this.criterias.size;
	}
	addCriteriaAttributes(name, weight, method){
		if(name.length<3 || weight==="" || isNaN(weight)||method==="") return false;
		weight = parseFloat(weight);
		method = parseInt(method);
		for (const criteria of this.criterias.data) {
			if(name === criteria.name){
				return false;
			}
		}
		this._started = true;
		this.criterias.data.push({name,weight,method});
		return true;
	}
	criteriaAttributesIsSet(){
		return this.criterias.data.length >= this.criterias.size;
	}
	getCriteriaAttributes(idx){
		return this.criterias.data[idx];
	}
	setCriteriaAttributes(idx, name, weight, method){
		if(name.length<3 || weight==="" || isNaN(weight)||method==="") return false;
		weight = parseFloat(weight);
		method = parseInt(method);
		if(this.criterias.data[idx].name!==name){
			for (const criteria of this.criterias.data) {
				if(name === criteria.name){
					return false;
				}
			}
		}
		this._started = true;
		this.criterias.data[idx]={name,weight,method};
		return true;
	}
	getCriteriasAttributes(){
		return this.criterias.data.slice();
	}

	addLamda(lamda){
		if(lamda === "" || isNaN(lamda)) return false;
		this._started = true;
		this.lamdas.data.push(lamda);
		return true;
	}
	lamdaIsSet(){
		return this.lamdas.data.length >= this.criterias.size;
	}
	lamdaGlobalIsSet(){
		return this.lamdas.global !== null ;
	}
	setLamdaGlobal(lamda){
		this._started = true;
		this.lamdas.global = lamda;
		return true;
	}
	getLamdas(){
		return this.lamdas.data.slice();
	}
	getLamdaGlobal(){
		return this.lamdas.global;
	}
	getLamda(index){
		return this.lamdas.data[index];
	}
	setLamda(index, lamda){
		this._started = true;
		this.lamdas.data[index] = lamda;
	}

	getLastPeriodNotSet(){
		for (let i = 0; i < this.periods.size; i++) {
			if(this.data[i][this.actions.size-1][0]==null){
				return {
					index:i,
					name:this.periods.data[i].name,
					data:this.data[i].slice()
				}
			}
		}
		return null;
	}

	addData(periodIndex, actionIndex, data){
		this._started = true;
		this.data[periodIndex][actionIndex] = data.slice();
	}
	getData(periodIndex, actionIndex, criteriaIndex){
		if(periodIndex==="all"){
			const data = [];
			for (let i = 0; i < this.periods.size; i++) {
				data.push(this._getDataByAction(i, actionIndex, criteriaIndex));
			}
			console.log(data);
			return data;
		}else{
			return this._getDataByAction(periodIndex, actionIndex, criteriaIndex);
		}
		
	}
	_getDataByAction(periodIndex, actionIndex, criteriaIndex){
		if(actionIndex==="all"){
			const data = [];
			for (let i = 0; i < this.actions.size; i++) {
				data.push(this._getDataCriteria(periodIndex, i, criteriaIndex));
			}
			console.log(data);
			return data;
		}else{
			return this._getDataCriteria(periodIndex, actionIndex, criteriaIndex);
		}
	}
	_getDataCriteria(periodIndex, actionIndex, criteriaIndex){
		if(criteriaIndex==="all"){
			return this.data[periodIndex][actionIndex].slice();
		}else{
			return this.data[periodIndex][actionIndex][criteriaIndex];
		}
	}
	setData(periodIndex, actionIndex, criteriaIndex, value){
		this._started = true;
		this.data[periodIndex][actionIndex][criteriaIndex] = value;
	}
		
	getConcordance(index){
		this._normalize();
		const indices = [];
		for (let aIdx1 = 0; aIdx1 < this.actions.size; aIdx1++) {
			indices[aIdx1] = [];
			for (let aIdx2 = 0; aIdx2 < this.actions.size; aIdx2++) {
				if(aIdx1 === aIdx2){
					indices[aIdx1][aIdx2] = null;
				}else{
					let indice = 0;
					for (let i = 0; i < this.periods.size; i++) {
						if(this._isPrefers(this.data[i][aIdx1][index],this.data[i][aIdx2][index],this.criterias.data[index].method)){
							indice = this.round(indice + this.periods.data[i].weightNorm);
						}
					}
					indices[aIdx1][aIdx2] = indice;
				}
			}
		}
		
		return indices;
	}
	getDiscordance(index){
		this._normalize();
		const indices = [];
		for (let aIdx1 = 0; aIdx1 < this.actions.size; aIdx1++) {
			indices[aIdx1] = [];
			for (let aIdx2 = 0; aIdx2 < this.actions.size; aIdx2++) {
				if(aIdx1 === aIdx2){
					indices[aIdx1][aIdx2] = null;
				}else{
					let cIndice = 0;
					for (let i = 0; i < this.periods.size; i++) {
						if(this._isPrefers(this.data[i][aIdx1][index],this.data[i][aIdx2][index],this.criterias.data[index].method)){
							cIndice = this.round(cIndice + this.periods.data[i].weightNorm);;
						}
					}
					let indice = 1;
					if(cIndice<1){
						const cIndiceM = this.round(1-cIndice);
						for (let i = 0; i < this.periods.size; i++) {
							if(this.periods.data[i].weightNorm>cIndice && 
								!this._isPrefers(this.data[i][aIdx1][index],this.data[i][aIdx2][index],this.criterias.data[index].method)){								
								indice = this.round(indice* (this.round(1-this.periods.data[i].weightNorm)/cIndiceM));
							}
						}
					}
					indices[aIdx1][aIdx2] = indice;;
				}
			}
		}
		return indices;
	}
	getCredibility(index){
		this._normalize();
		const indices = [];
		for (let aIdx1 = 0; aIdx1 < this.actions.size; aIdx1++) {
			indices[aIdx1] = [];
			for (let aIdx2 = 0; aIdx2 < this.actions.size; aIdx2++) {
				if(aIdx1 === aIdx2){
					indices[aIdx1][aIdx2] = null;
				}else{
					let cIndice = 0;
					for (let i = 0; i < this.periods.size; i++) {
						if(this._isPrefers(this.data[i][aIdx1][index],this.data[i][aIdx2][index],this.criterias.data[index].method)){
							cIndice = this.round(cIndice + this.periods.data[i].weightNorm);;
						}
					}
					let dIndice = 1;
					if(cIndice<1){
						const cIndiceM = this.round(1-cIndice);
						for (let i = 0; i < this.periods.size; i++) {
							if(this.periods.data[i].weightNorm>cIndice && 
								!this._isPrefers(this.data[i][aIdx1][index],this.data[i][aIdx2][index],this.criterias.data[index].method)){								
								dIndice = this.round(dIndice* (this.round(1-this.periods.data[i].weightNorm)/cIndiceM));
							}
						}
					}
					indices[aIdx1][aIdx2] = cIndice * dIndice;
				}
			}
		}
		return indices;
	}
	getSurclassement(index){
		const data = this.getCredibility(index);
		const lamda = this.getLamda(index);
		return data.map(dt=>{
			return dt.map(d=>d===null?d:d<lamda?"no":lamda);
		});
	}
	getConcordanceGlobal(){
		const data = Array(this.actions.size).fill().map(_=>Array(this.actions.size).fill(0));
		for (let i = 0; i < this.criterias.size; i++) {
			const surData = this.getSurclassement(i);
			for (let ai1 = 0; ai1 < this.actions.size; ai1++) {
				for (let ai2 = 0; ai2 < this.actions.size; ai2++) {
					if(ai1===ai2){
						data[ai1][ai2] = null;
					}else if(surData[ai1][ai2]!=="no"){
						data[ai1][ai2] = this.round(data[ai1][ai2]+ this.criterias.data[i].weightNorm);
					}
				}
			}
		}
		return data;
	}
	getDiscordanceGlobal(){
		const data = Array(this.actions.size).fill().map(_=>Array(this.actions.size).fill(1));
		const cData = this.getConcordanceGlobal();
		for (let i = 0; i < this.criterias.size; i++) {
			const surData = this.getSurclassement(i);
			for (let ai1 = 0; ai1 < this.actions.size; ai1++) {
				for (let ai2 = 0; ai2 < this.actions.size; ai2++) {
					if(ai1===ai2){
						data[ai1][ai2] = null;
					}else if(this.criterias.data[i].weightNorm>cData[ai1][ai2] && surData[ai1][ai2]==="no"){
							const cIndiceM = this.round(1-cData[ai1][ai2]);
							data[ai1][ai2] = this.round(data[ai1][ai2] * (this.round(1-this.criterias.data[i].weightNorm)/cIndiceM));
					}
				}
			}
		}
		return data;
	}
	getCredibilityGlobal(){
		const data = Array(this.actions.size).fill().map(_=>Array(this.actions.size).fill(1));
		const dData = Array(this.actions.size).fill().map(_=>Array(this.actions.size).fill(1));
		const cData = this.getConcordanceGlobal();
		for (let i = 0; i < this.criterias.size; i++) {
			const surData = this.getSurclassement(i);
			for (let ai1 = 0; ai1 < this.actions.size; ai1++) {
				for (let ai2 = 0; ai2 < this.actions.size; ai2++) {
					if(ai1===ai2){
						dData[ai1][ai2] = null;
					}else if(this.criterias.data[i].weightNorm>cData[ai1][ai2] && surData[ai1][ai2]==="no"){
							const cIndiceM = this.round(1-cData[ai1][ai2]);
							dData[ai1][ai2] = this.round(dData[ai1][ai2] * (this.round(1-this.criterias.data[i].weightNorm)/cIndiceM));
					}
				}
			}
		}
		for (let ai1 = 0; ai1 < this.actions.size; ai1++) {
			for (let ai2 = 0; ai2 < this.actions.size; ai2++) {
				if(ai1===ai2){
					data[ai1][ai2] = null;
				}else{
					data[ai1][ai2] = dData[ai1][ai2] * cData[ai1][ai2];
				}
			}
		}
		return data;
	}
	getSurclassementGlobal(){
		const data = Array(this.actions.size).fill().map(_=>Array(this.actions.size).fill(1));
		const cData = this.getCredibilityGlobal();
		for (let ai1 = 0; ai1 < this.actions.size; ai1++) {
			for (let ai2 = 0; ai2 < this.actions.size; ai2++) {
				if(ai1===ai2){
					data[ai1][ai2] = null;
				}else{
					data[ai1][ai2] = cData[ai1][ai2]>this.lamdas.global?this.lamdas.global:"no";
				}
			}
		}
		return data;
	}
	_normalize(){
		if(this._normalized) return;
		this.criterias.weightSum = this.criterias.data.reduce((infoA, infoB) =>{
			return this.round(infoA+infoB.weight);
		}, 0);
		this.periods.weightSum = this.periods.data.reduce((infoA, infoB) => {
			return this.round(infoA+infoB.weight);
		}, 0);
		this.criterias.data.forEach(info => {
			info.weightNorm = this.round(info.weight/this.criterias.weightSum);
		});
		this.periods.data.forEach(info => {
			info.weightNorm = this.round(info.weight/this.periods.weightSum);
		});
		this._normalized = true;
	}
	_isPrefers(val1, val2, method){
		return method == 0 ? (val1 == val2) : (val1 * method > val2 * method);
	}
}