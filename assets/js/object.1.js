class Coreta {
	constructor(){
		this.reset();
	}
	setSize(period, object, criteria){
		if(period<2||object<2||criteria<2) return false;
		this.objects.size = object;
		this.periods.size = period;
		this.criterias.size = criteria;
		this._initData();
		return true;
	}
	sizesIsSet(){
		return this.periods.size >= 2 && this.objects.size >= 2 && this.criterias.size >= 2;
	}
	_initData(){
		this.periods.size = parseInt(this.periods.size);
		this.criterias.size = parseInt(this.criterias.size);
		this.objects.size = parseInt(this.objects.size);
		for (let pI = 0; pI < this.periods.size; pI++) {
			this.data[pI]=[];
			for (let oI = 0; oI < this.objects.size; oI++) {
				this.data[pI][oI] = Array(this.criterias.size).fill(null);
			}
		}
	}
	objectsAttributeIsSet(){
		return this.objects.data.length>=this.objects.size;
	}
	periodsAttributeIsSet(){
		return this.periods.data.length>=this.periods.size;
	}
	criteriasAttributeIsSet(){
		return this.criterias.data.length>=this.criterias.size;
	}
	attributesIsSet(){
		return this.criteriasAttributeIsSet() && this.periodsAttributeIsSet() && this.objectsAttributeIsSet();
	}
	resetPeriodIndex(){
		this.periodIndex = -1;
	}
	resetObjectIndex(){
		this.objectIndex = -1;
	}
	resetCriteriaIndex(){
		this.criteriaIndex = -1;
	}
	hasNextPeriod(){
		this.periodIndex++;
		return this.periodIndex < this.periods.size;
	}
	hasNextObject(){
		this.objectIndex++;
		return this.objectIndex < this.objects.size;
	}
	hasNextCriteria(){
		this.criteriaIndex++;
		return this.criteriaIndex < this.criterias.size;
	}
	getPeriod(){
		return this.periods.data[this.periodIndex];
	}
	getObject(){
		return this.objects.data[this.objectIndex];
	}
	getCriteria(){
		return this.criterias.data[this.criteriaIndex];
	}
	getCriteriasNames(){
		// if(this.criterias.size==0){
		// 	const data1 = ["criteria 1", "criteria 2", "criteria 3", "criteria 4"]
		// 	data1.forEach(d=>{
		// 		this.criterias.data.push({name:d,weight:1,method:1})
		// 	})
		// }
		// this.criterias.size = 4;
		return this.criterias.data.map(data=>{
			return data.name;
		});
	}
	getPeriodsNames(){
		// if(this.periods.size==0){
		// 	const data1 = ["period 1", "period 2"]//, "period 2", "period 2", "period 2", "period 2", "period 2", "period 2", "period 2"]
		// 	data1.forEach(d=>{
		// 		this.periods.data.push({name:d,weight:1})
		// 	})
		// }
		// this.periods.size = 2;
		return this.periods.data.map(data=>{
			return data.name;
		});
	}
	getObjectsNames(){
		console.error("getObjectsNames");
		return this.objects.data.map(data=>{
			console.log(data);
			return data.name;
		});
	}
	addPeriod(period){
		if(this.periodsAttributeIsSet()){
			console.error("period is set");
			return false;
		}
		if(this.isValidAttribute("period", period)){
			for (const data of this.periods.data) {
				if(data.name==period.name) return false;
			}
			this.periods.data.push({
				name:period.name,
				weight:parseInt(period.weight)
			});
			return true;
		}
		return false;
	}
	addObject(object){
		if(this.objectsAttributeIsSet()){
			console.error("object is set");
			return false;
		}
		if(this.isValidAttribute("object", object)){
			for (const data of this.objects.data) {
				if(data.name==object.name) return false;
			}
			this.objects.data.push({
				name:object.name
			})
			return true;
		}
		return false;
	}
	addCriteria(criteria){
		if(this.criteriasAttributeIsSet()){
			console.error("criteria is set");
			return false;
		}
		if(this.isValidAttribute("criteria", criteria)){
			for (const data of this.criterias.data) {
				if(data.name==criteria.name) return false;
			}
			this.criterias.data.push({
				name:criteria.name,
				weight:parseInt(criteria.weight),
				method:parseInt(criteria.method)
			})
			return true;
		}
		return false;
	}
	isValidAttribute(attribute, value){
		if(value.name.length<3) return false;
		if(attribute=="object") return true;
		if(isNaN(value.weight)|| value.weight.length==0) return false;
		if(attribute=="period") return true;
		return value.method == -1 || value.method === 0 || value.method === "0" || value.method == 1
	}
	getObjectAttributes(){
		return this.objects.data.slice();
	}
	getPeriodAttributes(){
		return this.periods.data.slice();
	}
	getCriteriaAttributes(){
		return this.criterias.data.slice();
	}
	setData(period, object, criterias){
		const pI = this._getPeriodIndex(period);
		const oI = this._getObjectIndex(object);
		this.data[pI][oI]=criterias.slice();
	}
	getData(by={}){
		const period=by.period||"all",
			object=by.object||"all",
			criteria=by.criteria||"all";
		let pL , oL, cL, pI, oI, cI;
		if(period=="all"){
			pL = this.data.length;
			pI = 0;
		}else{
			pL = 1;
			pI =this._getPeriodIndex(period);
		}
		if(object=="all"){
			oL = this.data[0].length;
			oI = 0;
		}else{
			oL = 1;
			oI =this._getObjectIndex(object);
		}
		if(criteria=="all"){
			cL = this.data[0][0].length;
			cI = 0;
		}else{
			cL = 1;
			cI =this._getCriteriaIndex(criteria);
		}
		const tempData= [];
		for (let i = 0; i < pL; i++) {
			tempData[i] = [];
			for (let j = 0; j < oL; j++) {
				tempData[i][j]=[];
				for (let k = 0; k < cL; k++) {
					tempData[i][j][k] = this.data[i+pI][j+oI][k+cI];
					
				}
				if(cL==1){
					tempData[i][j] = tempData[i][j][0];
				}
			}
			if(oL==1){
				tempData[i] = tempData[i][0]
			}
		}
		return pL==1?tempData[0]:tempData;
	}
	_getPeriodIndex(name){
		for (let i = 0; i < this.periods.size; i++) {
			if(this.periods.data[i].name==name) return i;
		}
		return -1;
	}
	_getObjectIndex(name){
		for (let i = 0; i < this.objects.size; i++) {
			if(this.objects.data[i].name==name) return i;
		}
		return -1;
	}
	_getCriteriaIndex(name){
		for (let i = 0; i < this.criterias.size; i++) {
			if(this.criterias.data[i].name==name) return i;
		}
		return -1;
	}
	normalize(){
		console.warn("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
		this.criterias.weightSum = this.criterias.data.reduce(function (infoA, infoB) {
			return infoA+infoB.weight;
		}, 0);
		this.periods.weightSum = this.periods.data.reduce(function (infoA, infoB) {
			return infoA+infoB.weight;
		}, 0);
		this.criterias.data.forEach(info => {
			info.weightNorm = info.weight/this.criterias.weightSum;
		});
		this.periods.data.forEach(info => {
			info.weightNorm = info.weight/this.periods.weightSum;
		});
		console.log(this);
		console.log("save");
	}
	getSizes(objectFormat=true){
		const period = this.periods.size ;
		const object = this.objects.size ;
		const criteria= this.criterias.size ;
		return objectFormat?{period, object, criteria}:[period, object, criteria];
	}
	getIndices(obj1, obj2){
		const oI1 = this._getObjectIndex(obj1);
		const oI2 = this._getObjectIndex(obj2);
		const byPeriod = [];
		const period = {
			cocordance:0,
			discordance:1
		};
		for (let pI = 0; pI < this.periods.size; pI++) {
			let cocordance = 0;
			let discordance = 1;
			let isPrefer = true; 
			let isNotPrefer = true;
			for (let cI = 0; cI < this.criterias.size; cI++) {
				if(this._isPrefers(this.data[pI][oI1][cI],this.data[pI][oI2][cI],this.criterias.data[cI].method)){
					cocordance+=this.criterias.data[cI].weightNorm;
					isNotPrefer = false;
				}else{
					isPrefer = false;
					discordance*=this.criterias.data[cI].weightNorm;
				}
			}
			if(isPrefer){
				period.cocordance+=this.periods.data[pI].weightNorm;
			}else if(isNotPrefer){
				period.discordance*=this.periods.data[pI].weightNorm;
			}
			byPeriod.push({name:this.periods.data[pI].name,cocordance,discordance,cridible:discordance*cocordance});
		}
		const byCriteria = [];
		const criteria = {
			cocordance:0,
			discordance:1
		};
		for (let cI = 0; cI < this.criterias.size; cI++) {
			let cocordance = 0;
			let discordance = 1;
			let isPrefer = true; 
			let isNotPrefer = true;
			for (let pI = 0; pI < this.periods.size; pI++) {
				if(this._isPrefers(this.data[pI][oI1][cI], this.data[pI][oI2][cI], this.criterias.data[cI].method)){
					cocordance+=this.periods.data[pI].weightNorm;
					isNotPrefer = false;
				}else{
					discordance*=this.periods.data[pI].weightNorm;
					isPrefer = false;
				}
			}
			if(isPrefer){
				criteria.cocordance+=this.criterias.data[cI].weightNorm;
			}else if(isNotPrefer){
				criteria.discordance*=this.criterias.data[cI].weightNorm;
			}
			byCriteria.push({name:this.criterias.data[cI].name,cocordance,discordance,cridible:discordance*cocordance});
		}
		criteria.cridible = criteria.cocordance*criteria.discordance;
		period.cridible = period.cocordance*period.discordance;
		return {byPeriod, byCriteria, criteria, period};
	}
	
	getIndicesByCriteria(type){
		const indices = [];
		for (let cIdx = 0; cIdx < this.criterias.size; cIdx++) {
			indices[cIdx] = [];
			for (let oIdx1 = 0; oIdx1 < this.objects.size; oIdx1++) {
				indices[cIdx][oIdx1] = [];
				for (let oIdx2 = 0; oIdx2 < this.objects.size; oIdx2++) {
					if(oIdx1 === oIdx2){
						indices[cIdx][oIdx1][oIdx2] = null;
					}else{
						indices[cIdx][oIdx1][oIdx2] = this._getIndiceByCriteria(type, cIdx, oIdx1, oIdx2);
					}
				}
				
			}
			
		}
		return indices;
	}
	_getIndiceByCriteria(type, cIdx, oIdx1, oIdx2){
		let indice;
		switch (type) {
			case "concordance":
				indice = 0;
				for (let i = 0; i < this.periods.size; i++) {
					if(this._isPrefers(this.data[i][oIdx1][cIdx],this.data[i][oIdx2][cIdx],this.criterias.data[cIdx].method)){
						indice += this.periods.data[i].weightNorm;						
					}
					
				}
				break;
			case "discordance":
				indice = 1;
				for (let i = 0; i < this.periods.size; i++) {
					if(this._isPrefers(this.data[i][oIdx1][cIdx],this.data[i][oIdx2][cIdx],this.criterias.data[cIdx].method)){
						indice *= this.periods.data[i].weightNorm;
					}
					
				}
				break;
			case "cridibility":
				let indice1 = 0;
				let indice2 = 1;
				for (let i = 0; i < this.periods.size; i++) {
					if(this._isPrefers(this.data[i][oIdx1][cIdx],this.data[i][oIdx2][cIdx],this.criterias.data[cIdx].method)){
						indice2 *= this.periods.data[i].weightNorm;
						indice1 += this.periods.data[i].weightNorm;
					}
					
				}
				indice = indice1*indice2;
				break;
		
			default:
			console.error("type uknown");
				break;
		}
		return indice;
	}
	_isPrefers(val1, val2, method){
		return method == 0 ? (val1 == val2) : (val1 * method > val2 * method);
	}
	stringify(){
		return JSON.stringify({
			objects : this.objects ,
			periods : this.periods,
			criterias : this.criterias ,
			data : this.data 
		});
	}
	create(json){
		const obj = JSON.parse(json);
		this.objects = obj.objects;
		this.periods = obj.periods;
		this.criterias = obj.criterias;
		this.data = obj.data;
	}
	reset(){
		this.objects ={
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
		}
		this.data = [];
		this.periodIndex = 0;
		this.criteriaIndex = 0;
		this.objectIndex = 0;
	}
	getFirstPeriodNotFull(){
		for (let i = 0; i < this.periods.size; i++) {
			for (let j = 0; j < this.objects.size; j++) {
					if(this.data[i][j][0]==null){
						return {
							period:this.periods.data[i].name,
							data:this.data[i].slice()
						}
					}
			}
		}
		const i = this.periods.size-1;
		return {
			period:this.periods.data[i].name,
			data:this.data[i].slice()
		}
	}
}
