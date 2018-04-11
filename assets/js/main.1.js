window.addEventListener("load", function () {
	const $ = {};
	const fn = {};
	const val = {}
	const flag = {};
	const coreta = new Coreta;
	
	initStorage();
	initNavigation();
	initModals();
	initStep1();
	initStep2();
	initStep3();
	initStep4();
	if(flag.hasStorage){
		fn.create();
	}


	function initNavigation() {
		$.section = document.querySelector('.steps');
		const $btnNavigations = document.querySelectorAll('.navigation');
		let transitionEnd = true;
		for (const $btn of $btnNavigations) {
			const dir = $btn.getAttribute("data-direction");
			$btn.addEventListener("click", function () {
				if (!transitionEnd)
					return;
				transitionEnd = false;
				$.section.className = `steps ${dir}`;
				setTimeout(() => {
					$.section.setAttribute("data-step", $btn.value);
					setTimeout(() => {
						transitionEnd = true;
					}, 500);
				}, 50);
			});
		}
	}
	function initModals() {
		let cancelIsAllow = false;
		let modal = 1;
		const $modalContainer = document.getElementById('modal-container');
		const $btnNewCoreta = document.getElementById('new-coreta');
		const $inputSizeObject = document.getElementById('size-object');
		const $inputSizePeriod = document.getElementById('size-period');
		const $inputSizeCriteria = document.getElementById('size-criteria');
		const $btnRestore = document.getElementById('restore-coreta');
		const $btnSave = document.getElementById('save-coreta');
		const $btnCancels = document.querySelectorAll('.cancel');
		const $btnGetNew = document.querySelectorAll('.get-new-coreta');
		$btnCancels.forEach($btn=>{
			$btn.addEventListener("click",_=>{
				fn.closeModal();
			});
		});
		$btnGetNew.forEach($btn=>{
			$btn.addEventListener("click",_=>{
				fn.showModal(1);
			});
		});
		fn.alertModal = function () {
			$modalContainer.classList.add("alert");
			setTimeout(() => {
				$modalContainer.classList.remove("alert");
			}, 1000);
		}
		fn.showModal = function (idx) {
			$modalContainer.style.display = "block";
			$modalContainer.setAttribute("data-modal", idx);
			setTimeout(() => {
				$modalContainer.className = "modals show";
			}, 50);
		}
		fn.closeModal = function () {
			setTimeout(() => {
				$modalContainer.style.display = "";
			}, 100);
			$modalContainer.className = "modals";
		}
		fn.selectShowModal = function () {
			if(flag.startNew){
				$btnRestore.disabled = !flag.hasStorage;
				fn.showModal(3);
				modal = 3;
				cancelIsAllow = true;
			}else{
				if(flag.hasStorage){
					fn.showModal(2);
					modal = 2;
					cancelIsAllow = true;
				}else{
					fn.showModal(1);
					modal = 1;
					cancelIsAllow = false;
				}
			}
			// fn.showModal(1);
		}
		$modalContainer.addEventListener("click", function (e) {
			if(e.target!==$modalContainer)return;
			if(cancelIsAllow){
				fn.closeModal();
			}else{
				fn.alertModal();
			}
		});
		
		$btnSave.addEventListener("click", function  () {
			localStorage.setItem("lastCoreta", coreta.stringify());
			fn.closeModal();
			flag.hasStorage = true;
			flag.startNew = false;
		});
		// fn.showModal(1);
		// fn.alertModal();
		fn.selectShowModal();

		//new || new&continue
		//new : $btnNewCoreta
		/**
		 * flag.startNew = true
		 * btnStep1Next.value = 2
		 * coreta.reset()
		 * coreta.setSizes(...)
		 * fn.setWidth()
		 */
		$btnNewCoreta.addEventListener("click", function () {
			if($inputSizeObject.value==""||$inputSizePeriod.value==""||$inputSizeCriteria.value=="") return;
			if(coreta.setSize($inputSizePeriod.value, $inputSizeObject.value, $inputSizeCriteria.value)){
				coreta.reset();
				coreta.setSize($inputSizePeriod.value, $inputSizeObject.value, $inputSizeCriteria.value);
				fn.setAttributesInDOM();
				fn.closeModal();
				flag.startNew = true;
				$.btnStep1Next.value = 2;
			}
		});
		// new&continue:$new
		$btnGetNew.forEach($btn=>{
			$btn.addEventListener("click",_=>{
				fn.showModal(1);
			});
		});




	}
	function initStep1() {
		const $addObject = document.getElementById('add-object');
		const $btnAddObject = document.getElementById('btn-add-object');
		const $inAddObject = document.getElementById('in-add-object');
		const $outAddObject = document.getElementById('out-add-object');
 
		const $addCriteria = document.getElementById('add-criteria');
		const $btnAddCriteria = document.getElementById('btn-add-criteria');
		const $inAddCriteriaName = document.getElementById('in-add-criteria-name');
		const $inAddCriteriaWeight = document.getElementById('in-add-criteria-weight');
		const $inAddCriteriaMethod = document.getElementById('in-add-criteria-method');
		const $outAddCriteria = document.getElementById('out-add-criteria');
 
		const $addPeriod = document.getElementById('add-period');
		const $btnAddPeriod = document.getElementById('btn-add-period');
		const $inAddPeriodName = document.getElementById('in-add-period-name');
		const $inAddPeriodWeight = document.getElementById('in-add-period-weight');
		const $outAddPeriod = document.getElementById('out-add-period');
		 
		const $tableAttributeObject = $addObject.querySelector('table');
		const $tableAttributePeriod = $addPeriod.querySelector('table');
		const $tableAttributeCriteria = $addCriteria.querySelector('table');
 
		$.btnStep1Next = document.getElementById('btn-step1-next');
 
		fn.addObjectToDOM = getAddAttributeToDOMFunction($outAddObject, $tableAttributeObject);
		fn.addPeriodToDOM = getAddAttributeToDOMFunction($outAddPeriod, $tableAttributePeriod);
		fn.addCriteriaToDOM = getAddAttributeToDOMFunction($outAddCriteria, $tableAttributeCriteria);		
		fn.getObjectFromDOM = getGetAttributeFromDOMFunction([$inAddObject]);
		fn.getPeriodFromDOM = getGetAttributeFromDOMFunction([$inAddPeriodName, $inAddPeriodWeight]);
		fn.getCriteriaFromDOM = getGetAttributeFromDOMFunction([$inAddCriteriaName, $inAddCriteriaWeight, $inAddCriteriaMethod]);
		fn.clearAddObjectInputs = getclearAddInputsFunction([$inAddObject]);
		fn.clearAddPeriodInputs = getclearAddInputsFunction([$inAddPeriodName, $inAddPeriodWeight]);
		fn.clearAddCriteriaInputs = getclearAddInputsFunction([$inAddCriteriaName, $inAddCriteriaWeight, $inAddCriteriaMethod]);
		 function setWidths(period, object, criteria){
			val.cellWidth = (period<20&&object<20&criteria<20)?96:48;
		}
		fn.setAttributesInDOM = function () {
			$.btnStep1Next.disabled = true;
			$.section.setAttribute("data-step", 1);
			$outAddCriteria.innerHTML = "";
			$outAddPeriod.innerHTML = "";
			$outAddObject.innerHTML = "";
			$tableAttributeCriteria.style.width = "";
			$tableAttributePeriod.style.width = "";
			$tableAttributeObject.style.width = "";
			setWidths(...coreta.getSizes(false));
			coreta.getObjectAttributes().forEach(object=>fn.addObjectToDOM(object));
			coreta.getCriteriaAttributes().forEach(object=>fn.addCriteriaToDOM(object));
			coreta.getPeriodAttributes().forEach(object=>fn.addPeriodToDOM(object));
			$addCriteria.className = coreta.criteriasAttributeIsSet()?"table-form no-form":"table-form";
			$addObject.className = coreta.objectsAttributeIsSet()?"table-form no-form":"table-form";
			$addPeriod.className = coreta.periodsAttributeIsSet()?"table-form no-form":"table-form";
			if(coreta.attributesIsSet()){
				$.btnStep1Next.disabled = false;
			}
		}

		$btnAddPeriod.addEventListener("click", function () {
			const object = fn.getPeriodFromDOM();
			if(coreta.addPeriod(object)){
				fn.addPeriodToDOM(object);
				fn.clearAddPeriodInputs();
			}
			$addPeriod.className = coreta.periodsAttributeIsSet()?"table-form no-form":"table-form";
			if(coreta.attributesIsSet()){
				$.btnStep1Next.disabled = false;
			}
		})
		$btnAddCriteria.addEventListener("click", function () {
			const object = fn.getCriteriaFromDOM();
			if(coreta.addCriteria(object)){
				fn.addCriteriaToDOM(object);
				fn.clearAddCriteriaInputs();
			}
			$addCriteria.className = coreta.criteriasAttributeIsSet()?"table-form no-form":"table-form";
			if(coreta.attributesIsSet()){
				$.btnStep1Next.disabled = false;
			}
		})
		$btnAddObject.addEventListener("click", function () {
			const object = fn.getObjectFromDOM();
			if(coreta.addObject(object)){
				fn.addObjectToDOM(object);
				fn.clearAddObjectInputs();
			}
			$addObject.className = coreta.objectsAttributeIsSet()?"table-form no-form":"table-form";
			if(coreta.attributesIsSet()){
				$.btnStep1Next.disabled = false;
			}
		})
		function getAddAttributeToDOMFunction($out, $table) {
			return function (head) {
				const tds = []; 
				for(const key in head){
					tds.push(createElement("span",head[key]));
				}
				const w = $table.clientWidth<48?0:$table.clientWidth;
				$out.appendChild(createElement("td", tds));
				$table.style.width = `${w + val.cellWidth}px`;
				flag.startNew = true;
			}
		}
		function getGetAttributeFromDOMFunction($inputs) {
			return function () {
				const inputs = {};
				$inputs.forEach(input => {
					inputs[input.getAttribute("data-key")] = input.value;
				});
				return inputs;
			}
		}
		function getclearAddInputsFunction($inputs) {
			return function () {
				$inputs.forEach(input => {
					input.value = "";
				});
				$inputs[0].focus();
			}
		}
		// fn.setAttributesInDOM();
	}
	function initStep2() {
		const $periodName = document.getElementById('period-name');
		const $entryHead = document.getElementById('entry-head');
		const $entryBody = document.getElementById('entry-body');
		const $btnAddData = document.getElementById('btn-add-data');
		$.btnStep2Next = document.getElementById('btn-step2-next');
		let objects;
		let currentPeriod;
		let currentObjectIndex;
		let dataEntryHeaderIsSet = false;
		function setEntryHeader() {
			dataEntryHeaderIsSet = true;
			$entryHead.appendChild(createElement("th",""));
			const names = coreta.getCriteriasNames();
			objects = coreta.getObjectsNames();
			$entryHead.style.width = `${names.length*val.cellWidth}px`;
			names.forEach(name=>$entryHead.appendChild(createElement("th",name)));
		}
		function setNewEntryData() {
			const {period, data} = coreta.getFirstPeriodNotFull();
			$periodName.innerText = period;
			currentPeriod = period;
			$entryBody.innerHTML = "";
			let i = 0;
			$btnAddData.disabled = true;
			$.btnStep2Next.disabled = false;
			for (const objs of data) {	
				if(objs[0]===null){
					addRow(objects[i], objs.length);
					currentObjectIndex = i;
					$btnAddData.disabled = false;
					$.btnStep2Next.disabled = true;
					break;
				}
				addRow(objects[i], objs);
				i++;
			}
		}
		
		function addRow(th, tds){
			const $tr = document.createElement("tr");
			$tr.appendChild(createElement("th",th));
			if(Array.isArray(tds)){
				for (const td of tds) {
					$tr.appendChild(createElement("td",td));
				}
			}else{
				for (let i = 0; i < tds; i++) {
					const $input = document.createElement("input");
					$input.type = "number";
					$tr.appendChild(createElement("td",[$input]));
					
				}
			}
			$entryBody.appendChild($tr);
		}
		function getInputsValues () {
			const vals = [];
			const $inputs = $entryBody.querySelectorAll('input');
			for (const $input of $inputs) {
				if($input.value==""){
					return null;
				}
				vals.push($input.value);
			}
			return vals;
		}
		function setNewEntryDataLine(newVals) {
			convertInputToText();
			currentObjectIndex++;
			if(currentObjectIndex<objects.length){
				addRow(objects[currentObjectIndex],newVals.length)
			}else{
				setNewEntryData();
			}
		}
		function convertInputToText() {
			const $inputs = $entryBody.querySelectorAll('input');
			for (const $input of $inputs) {
				$input.parentElement.innerHTML = $input.value;
			}

		}
		$.btnStep1Next.addEventListener("click", function () {
			if(!dataEntryHeaderIsSet){
				setEntryHeader();
			}
			setNewEntryData();
		})
		$btnAddData.addEventListener("click", function() {
			const newVals = getInputsValues ();
			if(newVals){
				coreta.setData(currentPeriod,objects[currentObjectIndex],newVals);
				setNewEntryDataLine(newVals);
			}
		})
	}
	function initStep3() {
		const $selectPeriod = document.getElementById('select-period');
		const $selectObject = document.getElementById('select-object');
		const $selectCriteria = document.getElementById('select-criteria');
		const $selects = document.querySelectorAll('.filter > select');
		const $thead = document.getElementById('data-head');
		const $tbody = document.getElementById('data-body');
		$.btnStep3Next = document.getElementById('btn-step3-next');
		let $currentSelect;
		
		function setSelect($select, options) {
			$select.innerHTML = "";
			$select.appendChild(createElement("option","all",{value:"all"}));
			options.forEach(opt => {
				$select.appendChild(createElement("option",opt,{value:opt}));
			});
		}
		function limitAppearanceOfAll ($1, $2, $3) {
			if($1.value=="all"){
				if($2.value=="all"){
					$3.options[0].disabled = true;
					$currentSelect = $3;
				}else if($3.value=="all"){
					$2.options[0].disabled = true;
					$currentSelect = $2;
				}
			}else{
				$2.options[0].disabled = false;
				$3.options[0].disabled = false;
			}
		}
		function showData() {
			const data = coreta.getData({
				period:$selectPeriod.value,
				object:$selectObject.value,
				criteria:$selectCriteria.value
			});
			$thead .innerHTML="";
			$tbody .innerHTML="";
			console.log(data);
			if(Array.isArray(data)){
				const horiz = getHorizHeader();
				if(Array.isArray(data[0])){
					const vert = getVertHeader();
					setTableContent(horiz,"",true);
					for (let i = 0; i < data.length; i++) {
						setTableContent(data[i],vert[i]);
					}
				}else{
					setTableContent(horiz,null,true);
					setTableContent(data);
				}
			}else{
				$tbody.appendChild(createElement("tr",[createElement("td",data)]));
			}
		}
		function getHorizHeader() {
			if($selectCriteria.value==="all"){
				return coreta.getCriteriasNames();
			}
			if($selectObject.value==="all"){
				return coreta.getObjectsNames();
			}
			return coreta.getPeriodsNames();
		}
		function getVertHeader() {
			if($selectObject.value==="all" && $selectCriteria.value==="all"){
				return coreta.getObjectsNames();
			}
			return coreta.getPeriodsNames();
		}
		function setTableContent(data,before=null,isHeader=false) {
			let $tSection ,td;
			if(isHeader){
				$tSection = $thead;
				td = "th";
			}else{
				$tSection = $tbody;
				td = "td";
			}
			const $tr = document.createElement('tr');
			if(before!==null){
				$tr.appendChild(createElement('th',before,{title:before}));
			}
			for (const d of data) {
				$tr.appendChild(createElement(td,d,{title:d}));
			}
			$tSection.appendChild($tr);
		}
		for (let i = 0; i < $selects.length; i++) {
			$selects[i].addEventListener("change", function () {
				limitAppearanceOfAll($selects[i], $selects[(i+1)%3], $selects[(i+2)%3]);
				showData();
			});
		}
		$.btnStep2Next.addEventListener("click", function () {
			setDisplayData();
			$.btnStep1Next.value = 3;
			flag.dataIsSet = true;
			coreta.normalize();
		});
		$.btnStep1Next.addEventListener("click", function () {
			if(!flag.dataIsSet) return;
			setDisplayData();
		});

		function setDisplayData() {
			setSelect($selectPeriod, coreta.getPeriodsNames());
			setSelect($selectCriteria, coreta.getCriteriasNames());
			setSelect($selectObject, coreta.getObjectsNames());
			$selectPeriod.options[0].disabled = true;
			$selectPeriod.options[1].selected = true;
			$selectCriteria.options[0].selected = true;
			$selectObject.options[0].selected = true;
			$currentSelect = $selectPeriod;
			showData();
		}
	}
	function initStep4() {
		const $select = document.getElementById('select-by');
		const $tHead = document.getElementById('indices-head');
		const $tBody = document.getElementById('indices-body');
		let indices;
		let objects;
		function creatcCell(elem, value) {
			const $elem = document.createElement(elem);
			$elem.innerText = value;
			return $elem;
		}
		function setTable(objects, data, index){
			$tHead.innerHTML = "";
			$tBody.innerHTML = "";

			const $tr = document.createElement("tr");
			$tr.appendChild(creatcCell("th", ""));
			for (let i = 0; i < objects.length; i++) {
				$tr.appendChild(creatcCell("th", objects[i]));
			}
			$tHead.appendChild($tr);
			for (let i = 0; i < objects.length; i++) {
				const $tr = document.createElement("tr");
				$tr.appendChild(creatcCell("th", objects[i]));
				for (let j = 0; j < objects.length; j++) {
					if(i===j){
						$tr.appendChild(creatcCell("td", ""));
						continue;
					}
					$tr.appendChild(creatcCell("td", round(data[index][i][j], 3)));
				}
				$tBody.appendChild($tr);
			}
		}
		function set$select(options) {
			options.forEach(option => {
				const $option = document.createElement("option");
				$option.innerText = option;
				$option.value = option;
				$select.appendChild($option);
			});
		}
		function setIndicesByCriteria(type){
			indices = coreta.getIndicesByCriteria(type);
			objects = coreta.getObjectsNames();
			const criterias = coreta.getCriteriasNames();
			set$select(criterias);
			setTable(objects, indices, 0);
		}



		// fn.initIndicesDisplay = function () {
		// 	const objectsNames = coreta.getObjectsNames();
		// 	objectsNames.forEach(name => {
		// 		const $option = document.createElement("option");
		// 		$option.innerText = name;
		// 		$option.value = name;
		// 		$object1.appendChild($option.cloneNode(true));
		// 		$object2.appendChild($option);
		// 	});
		// 	$object1.options[0].selected = true;
		// 	$object2.options[1].selected = true;
		// }
		// function displayIndices(){
		// 	const indices = coreta.getIndices($object1.value, $object2.value);
		// 	setTable($criteriaHead, $criteriaBody , indices.byCriteria, indices.criteria);
		// 	setTable($periodHead, $periodBody , indices.byPeriod, indices.period);
		// }
		
		

		// $object1.addEventListener('change',function () {
		// 	if($object1.selectedIndex===$object2.selectedIndex) {
		// 		const i = $object1.selectedIndex + 1 < $object1.options.length?$object1.selectedIndex + 1:$object1.selectedIndex - 1;
		// 		$object2.options[i].selected = true;
		// 	}
		// 	displayIndices();
		// })
		// $object2.addEventListener('change',function () {
		// 	if($object1.selectedIndex===$object2.selectedIndex) {
		// 		const i = $object2.selectedIndex + 1 < $object2.options.length?$object2.selectedIndex + 1:$object2.selectedIndex - 1;
		// 		$object1.options[i].selected = true;
		// 	}
		// 	displayIndices();
		// })
		$select.addEventListener("change", function () {
			setTable(objects, indices, $select.selectedIndex);
		})
		const $btnIndiceConcordanceCriteria = document.getElementById('indice-concordance-criteria');
		$btnIndiceConcordanceCriteria.addEventListener("click", function () {
			//fn.initIndicesDisplay();
			setIndicesByCriteria("concordance")
			console.log("hiiiiiiiiiiiiiiiiiii");
		})
		// const $btnIndiceDiscordanceCriteria = document.getElementById('indice-discordance-criteria');
		// $btnIndiceDiscordanceCriteria.addEventListener("click", function () {
		// 	//fn.initIndicesDisplay();
		// 	setIndicesByCriteria("discordance")
		// 	console.log("hiiiiiiiiiiiiiiiiiii");
		// })
		// const $btnIndiCeCridibilityCriteria = document.getElementById('indice-cridibility-criteria');
		// $btnIndiCeCridibilityCriteria.addEventListener("click", function () {
		// 	//fn.initIndicesDisplay();
		// 	setIndicesByCriteria("cridibility")
		// 	console.log("hiiiiiiiiiiiiiiiiiii");
		// })
	}
	function initStorage() {
		flag.hasStorage = false;
		flag.startNew = false;
		flag.savedStorage = false;
		if (localStorage.getItem('lastCoreta')) {
			flag.hasStorage = true;
		}
		fn.create = function () {
			coreta.create(localStorage.getItem('lastCoreta'));
			fn.setAttributesInDOM();
		}
		document.querySelector('.storage').addEventListener("click",function () {
			fn.selectShowModal();
		});
	}
	function createElement(elem, ctns, option={}) {
		const $elem = document.createElement(elem);
		if(Array.isArray(ctns)){
			ctns.forEach(ctn => {
				$elem.appendChild(ctn);
			});
		}else{
			for (const key in option) {
				if (option.hasOwnProperty(key)) {
					ctns[key] = option[key];
				}
			}
			$elem.innerText = ctns;
		}
		return $elem;
	}
});
function round(number, precision) {
	var shift = function (number, precision, reverseShift) {
	  if (reverseShift) {
		precision = -precision;
	  }  
	  numArray = ("" + number).split("e");
	  return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
	};
	return shift(Math.round(shift(number, precision, false)), precision, true);
  }