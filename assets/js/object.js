class DataEntry {
    constructor(){
        this.periods = {
            size:0,
            info:[]
        };
        this.objects = {
            size:0,
            info:[]
        };
        this.criterias = {
            size:0,
            info:[],
            data:[]
        }
        this.periodIndex = 0;
        this.criteriaIndex = 0;
        this.objectIndex = 0;
    }
    sizesIsSet(){
        return this.periods.size >= 2 && this.objects.size >= 2 && this.criterias.size >= 2;
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
    }
    isObjectFull(){
        return this.objects.info.length>=this.objects.size;
    }
    isPeriodFull(){
        return this.periods.info.length>=this.periods.size;
    }
    isCriteriaFull(){
        return this.criterias.info.length>=this.criterias.size;
    }
    getSizes(){
        const period = this.periods.size ;
        const object = this.objects.size ;
        const criteria= this.criterias.size ;
        return {period, object, criteria};
    }
    resetPeriodIndex(){
        this.periodIndex = 0;
    }
    resetObjectIndex(){
        this.objectIndex = 0;
    }
    resetCriteriaIndex(){
        this.criteriaIndex = 0;
    }
    getPeriod(){
        const period = this.periods.info[this.periodIndex];
        this.periodIndex++;
        return period;
    }
    getObject(){
        const obj = this.objects.info[this.objectIndex];
        this.objectIndex++;
        return obj;
    }
    getCriteria(){
        const criteria = this.criterias.info[this.criteriaIndex];
        this.criteriaIndex++;
        return criteria;
    }
    getCriteriasNames(){
        return this.criterias.info.map(info=>info.name);
    }
    getObjectIndex(name){
        for (let i = 0; i < this.objects.info.length; i++) {
            const info = this.objects.info[i];
            if(info.name==name)return i;
        }
        return -1;
    }
    getPeriodIndex(name){
        for (let i = 0; i < this.periods.info.length; i++) {
            const info = this.periods.info[i];
            if(info.name==name)return i;
        }
        return -1;
    }
    getObjectsCriteriasByPeriod(period){
        const pI = this.getPeriodIndex(period);
        const criterias = [];
        for (let oI = 0; oI < this.objects.info.length; oI++) {
            if(!this.criterias.data[oI] || this.criterias.data[oI][pI].length==0){
                break;
            }
            criterias.push(this.criterias.data[oI][pI].slice());
        }
        return criterias;
    }
    addPeriod(period){
        if(this.isPeriodFull()){
            console.error("periods is full");
            return;
        }
        if(period.name.length<3) return false;
        for (const info of this.periods.info) {
            if(info.name==period.name) return false;
        }
        this.periods.info.push({
            name:period.name,
            weight:period.weight
        })
        return true;
    }
    addObject(object){
        if(this.isObjectFull()){
            console.error("objects is full");
            return false;
        }
        if(object.name.length<3) return false;
        for (const info of this.objects.info) {
            if(info.name==object.name) return false;
        }
        this.objects.info.push({
            name:object.name
        })
        return true;
    }
    addCriteria(criteria){
        if(this.isCriteriaFull()){
            console.error("criterias is full");
            return;
        }
        if(criteria.name.length<3) return false;
        for (const info of this.criterias.info) {
            if(info.name==criteria.name) return false;
        }
        this.criterias.info.push({
            name:criteria.name,
            weight:criteria.weight,
            method:criteria.method
        })
        return true;
    }
    hasPeriod(){
        return this.periodIndex<this.periods.info.length;
    }
    hasObject(){
        return this.objectIndex<this.objects.info.length;
    }
    addCriterias(object, period, criterias){
        console.log(object);
        console.log(period);
        const oI = this.getObjectIndex(object);
        const pI = this.getPeriodIndex(period);
        if(this.criterias.data.length===0){
            this._initCriteria();
            console.log("init");
        }
        this.criterias.data[oI][pI]=criterias.slice();
    }
    _initCriteria(){
        for (let oI = 0; oI < this.objects.info.length; oI++) {
            this.criterias.data[oI]=[];
            for (let pI = 0; pI < this.periods.info.length; pI++) {
                this.criterias.data[oI][pI]=[];//Array(this.criterias.size).fill(null);
            }
        }        
    }
}