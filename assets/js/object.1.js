class DataEntry {
	constructor(){
		this.reset();
	}
	setSize(attribute, value){
		switch (attribute) {
			case "object":
				this.objects.size = value;
				break;
			case "period":
				this.periods.size = value;
				break;
			case "criteria":
				this.criterias.size = value;
				break;
		}
		if(this.sizesIsSet()){
			this._initData();
		}
	}
	sizesIsSet(){
		return this.periods.size >= 2 && this.objects.size >= 2 && this.criterias.size >= 2;
	}
	_initData(){
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
		// if(this.objects.size==0){
		// 	const data1 = ["object 1", "object 2", "object 3"]
		// 	data1.forEach(d=>{
		// 		this.objects.data.push({name:d})
		// 	})
		// }
		// this.objects.size = 3;
		return this.objects.data.map(data=>{
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
	setData(period, object, criterias){
		const pI = this._getPeriodIndex(period);
		const oI = this._getObjectIndex(object);
		this.data[pI][oI]=criterias.slice();
	}
	getData(by={}){
		// this.data = [
		// 	[
		// 		[111,112,113,114],
		// 		[121,122,123,124],
		// 		[131,132,133,134]
		// 	],
		// 	[
		// 		[211,212,213,214],
		// 		[221,222,223,224],
		// 		[231,232,233,234]
		// 	],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ],
		// 	// [
		// 	// 	[211,212,213,214],
		// 	// 	[221,222,223,224],
		// 	// 	[231,232,233,234]
		// 	// ]
		// ]
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
		console.log(this.data);
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
		console.log(this.data);
		console.log(tempData);
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
	getSizes(){
		const period = this.periods.size ;
		const object = this.objects.size ;
		const criteria= this.criterias.size ;
		return {period, object, criteria};
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
	
	// getCriteriasNames(){
	//     return this.criterias.info.map(info=>info.name);
	// }
	// getObjectIndex(name){
	//     for (let i = 0; i < this.objects.info.length; i++) {
	//         const info = this.objects.info[i];
	//         if(info.name==name)return i;
	//     }
	//     return -1;
	// }
	// getPeriodIndex(name){
	//     for (let i = 0; i < this.periods.info.length; i++) {
	//         const info = this.periods.info[i];
	//         if(info.name==name)return i;
	//     }
	//     return -1;
	// }
	// getObjectsCriteriasByPeriod(period){
	//     const pI = this.getPeriodIndex(period);
	//     const criterias = [];
	//     for (let oI = 0; oI < this.objects.info.length; oI++) {
	//         if(!this.criterias.data[oI] || this.criterias.data[oI][pI].length==0){
	//             break;
	//         }
	//         criterias.push(this.criterias.data[oI][pI].slice());
	//     }
	//     return criterias;
	// }
	// addPeriod(period){
	//     if(this.isPeriodFull()){
	//         console.error("periods is full");
	//         return;
	//     }
	//     if(period.name.length<3) return false;
	//     for (const info of this.periods.info) {
	//         if(info.name==period.name) return false;
	//     }
	//     this.periods.info.push({
	//         name:period.name,
	//         weight:parseInt(period.weight)
	//     })
	//     return true;
	// }
	// addObject(object){
	//     if(this.isObjectFull()){
	//         console.error("objects is full");
	//         return false;
	//     }
	//     if(object.name.length<3) return false;
	//     for (const info of this.objects.info) {
	//         if(info.name==object.name) return false;
	//     }
	//     this.objects.info.push({
	//         name:object.name
	//     })
	//     return true;
	// }
	// addCriteria(criteria){
	//     if(this.isCriteriaFull()){
	//         console.error("criterias is full");
	//         return;
	//     }
	//     if(criteria.name.length<3) return false;
	//     for (const info of this.criterias.info) {
	//         if(info.name==criteria.name) return false;
	//     }
	//     this.criterias.info.push({
	//         name:criteria.name,
	//         weight:parseInt(criteria.weight),
	//         method:parseInt(criteria.method)
	//     })
	//     return true;
	// }
	// hasPeriod(){
	//     return this.periodIndex<this.periods.info.length;
	// }
	// hasObject(){
	//     return this.objectIndex<this.objects.info.length;
	// }
	// addCriterias(object, period, criterias){
	//     const oI = this.getObjectIndex(object);
	//     const pI = this.getPeriodIndex(period);
	//     if(this.criterias.data.length===0){
	//         this._initCriteria();
	//     }
	//     this.criterias.data[oI][pI]=criterias.slice();
	// }
	
	
}
