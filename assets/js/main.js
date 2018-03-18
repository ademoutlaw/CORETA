window.addEventListener("load", function () {
	
	const dataEntry = new DataEntry;
	window.dataEntry = dataEntry
	const $section = document.querySelector('.steps');
	const $storageNew = document.getElementById('storage-new');
	const $storageRestore = document.getElementById('storage-restore');
	const $storageSave = document.getElementById('storage-save');
	let cellWidth;
	let step2IsSet = false, step3IsSet = false, step4IsSet = false, step5IsSet = false;
	initNavigation();
	let hasRestore = initStorage();

	

	// step 1 ----------------------------------------------------------
	const $btnStep1 = document.getElementById('btn-step-1');
	initStep1();

	// step 2 -----------------------------------------------------------
	const $btnStep2N = document.getElementById('btn-step-2-n');
	const $btnStep2P = document.getElementById('btn-step-2-p');
	let criteriaWidth, objectWidth ,periodWidth;
	const $objectHeaderTable = document.getElementById('object-header-table');
	const $periodHeaderTable = document.getElementById('period-header-table');
	const $criteriaHeaderTable = document.getElementById('criteria-header-table');
	intiStep2();
	
	//step 3----------------------------------------------
	const $btnStep3N = document.getElementById('btn-step-3-n');
	const $btnStep3P = document.getElementById('btn-step-3-p');
	initStep3();
	// step 4 -------------------------------------------------
	const $btnStep4N = document.getElementById('btn-step-4-n');
	$btnStep3N.addEventListener("click", function () {
		$storageNew.disabled = false;
		if(step4IsSet)return;
		step4IsSet = true;
		$btnStep2N.value=4;
		dataEntry.normalize();
		// $storage.value="save";
		const $periodSelect = document.getElementById('select-period');
		const $objectSelect = document.getElementById('select-object');
		const $criteriaSelect = document.getElementById('select-criteria');
		const $tables = document.querySelector('.tables');
		let $selectFilter = $periodSelect;

		const $nextBtn = document.getElementById('next-view-page');
		const $prevBtn = document.getElementById('prev-view-page');

		const periodsNames = dataEntry.getPeriodsNames();
		const objectsNames = dataEntry.getObjectsNames();
		const criteriasNames = dataEntry.getCriteriasNames();
		let headerNames = periodsNames;

		let viewBy = "period";
		let viewOf = "period";
		let viewMode = "3d";
		let viewPageIndex = 1;
		let totalPages = 2;
		let data = dataEntry.getData();

		initSelectOptions($periodSelect, periodsNames, "select period");
		initSelectOptions($objectSelect, objectsNames, "select object");
		initSelectOptions($criteriaSelect, criteriasNames, "select criteria");

		$periodSelect.addEventListener("change", function() {
			periodChange();
		});
		$objectSelect.addEventListener("change", function() {
			objectChange();
		});
		$criteriaSelect.addEventListener("change", function() {
			criteriaChange();
		});

		$periodSelect.options[0].disabled = true;
		$periodSelect.value = periodsNames[0];
		
		$nextBtn.addEventListener("click", _=>{
			viewPageIndex++;
			$prevBtn.disabled = false;
			if(viewPageIndex==totalPages){
				$nextBtn.disabled = true;
			}
			$selectFilter.options[viewPageIndex].selected = true;
			paginationchange();
		});
		$prevBtn.addEventListener("click", _=>{
			viewPageIndex--;
			$nextBtn.disabled = false;
			if(viewPageIndex==1){
				$prevBtn.disabled = true;
			}
			$selectFilter.options[viewPageIndex].selected = true;
			paginationchange();
		});
		$prevBtn.disabled = true;
		function periodChange() {
			setFilterOptions($periodSelect, $objectSelect, $criteriaSelect);
			viewData();
		}
		function criteriaChange() {
			setFilterOptions($criteriaSelect, $periodSelect, $objectSelect);
			viewData();
		}
		function objectChange() {
			setFilterOptions($objectSelect, $periodSelect, $criteriaSelect);
			viewData();
		}
		function paginationchange(){
			switch (viewBy) {
				case "period":
					periodChange();
					break;
				case "object":
					objectChange();
					break;
				case "criteria":
					criteriaChange();
					break;
			
				default:
					break;
			}
		}
		function initSelectOptions($select, names, selectorName){
			const $option = document.createElement("option");
			$option.innerText = selectorName;
			$option.value = "all";
			$select.appendChild($option);
			names.forEach(name => {
				const $option = document.createElement("option");
				$option.innerText = name;
				$option.value = name;
				$select.appendChild($option);
			});
		}	
		function setFilterOptions($select, $select1, $select2){
			if($select.value !== "all"){
				$select1.options[0].disabled = false;
				$select2.options[0].disabled = false;
			}else{
				if($select1.value !== "all" && $select2.value !== "all"){
				}else if($select1.value !== "all"){
					$select1.options[0].disabled = true;
				}else{
					$select2.options[0].disabled = true;

				}
			}
		}
		function viewData(){
			let mode = 4;
			if($periodSelect.value!=="all"){
				mode--;
				$selectFilter = $periodSelect;
				viewBy = "period";
			}else{
				viewOf = "period";
				headerNames = periodsNames;
			}
			if($objectSelect.value!=="all"){
				mode--;
				$selectFilter = $objectSelect;
				viewBy = "object";
			}else{
				viewOf = "object";
				headerNames = objectsNames;
			}
			if($criteriaSelect.value!=="all"){
				mode--;
				$selectFilter = $criteriaSelect;
				viewBy = "criteria";
			}else{
				viewOf = "criteria";
				headerNames = criteriasNames;
			}
			//console.log(viewMode !== mode+"d");
			
			if(mode+"d"!=="3d"){
				data = dataEntry.getData({
					period:$periodSelect.value,
					object:$objectSelect.value,
					criteria:$criteriaSelect.value
				});
			}else{
				if(viewMode !== mode+"d"){
					data = dataEntry.getData();
				}
			}
			viewMode = mode+"d";
			switch (viewMode) {
				case "3d":
					viewData3d();
					break;
				case "2d":
					viewData2d();
					break;
				case "1d":
					viewData1d();
					break;			
				default:
					break;
			}

		}
		function setPagination() {
			viewPageIndex = getCurrentPage();
			totalPages = $selectFilter.options.length-1;
			$prevBtn.disabled = false;
			$nextBtn.disabled = false;
			if(viewPageIndex==1){
				$prevBtn.disabled = true;
			}else if(viewPageIndex==totalPages){
				$nextBtn.disabled = true;
			}
		}
		function getCurrentPage() {
			let i = 0;
			for(const opt of $selectFilter.options){
				if(opt.selected){
					return i ;
				}
				i++;
			}
		}
		function viewData3d() {
			setPagination();
			$tables.className = "tables mode3d";
			const $tableHead = document.getElementById('table-view-mode3d-head');
			const $tableBody = document.getElementById('table-view-mode3d-body');
			const $table = document.getElementById('table-view-mode3d');
			const pageIndex = viewPageIndex - 1;
			switch (viewBy) {
				case "period":
					$table.style.width = `${objectWidth+10}px`;
					setTable(objectsNames, criteriasNames, function (i, j) {
						return data[pageIndex][j][i];
					});
					break;
				case "object":
					$table.style.width = `${periodWidth+10}px`;
					setTable(periodsNames, criteriasNames, function (i, j) {
						return data[j][pageIndex][i];
					});
					break;
				case "criteria":
					$table.style.width = `${periodWidth+10}px`;
					setTable(periodsNames, objectsNames, function (i, j) {
						return data[j][i][pageIndex];
					});
					break;
			
				default:
					break;
			}
			function setTable(horizNames, vertNames,clbk) {
				$tableHead.innerHTML ="";
				$tableBody.innerHTML ="";
				$tableHead.appendChild(creatcCell("th",""));
				horizNames.forEach(function (name) {
					$tableHead.appendChild(creatcCell("th",name));
				});
				for (let i = 0; i < vertNames.length; i++) {
					const $tr = document.createElement("tr");
					$tr.appendChild(creatcCell("td",vertNames[i]));
					for (let j = 0; j < horizNames.length; j++) {
						$tr.appendChild(creatcCell("td",clbk(i,j)));				
					}
					$tableBody.appendChild($tr);
				}
			}
			function creatcCell(elem, value) {
				const $elem = document.createElement(elem);
				$elem.innerText = value;
				return $elem;
			}
		}
		function viewData2d() {
			$tables.className = "tables mode2d";
			const $tableHead = document.getElementById('table-view-mode2d-head');
			const $tableBody = document.getElementById('table-view-mode2d-body');
			const $table = document.getElementById('table-view-mode2d');
			$tableHead.innerHTML ="";
			$tableBody.innerHTML ="";
			headerNames.forEach(function (name) {
				$tableHead.appendChild(creatcCell("th",name));
			});
			const $tr = document.createElement("tr");
			data.forEach(d=>{
				$tr.appendChild(creatcCell("td",d));

			});
			$tableBody.appendChild($tr);			
			function creatcCell(elem, value) {
				const $elem = document.createElement(elem);
				$elem.innerText = value;
				return $elem;
			}
		}
		function viewData1d() {
			$tables.className = "tables mode1d";
			const $cell = document.getElementById('view-mode1d');
			$cell.innerText =  data;
		}
		paginationchange();
		
	});

	// step 5 --------------------------------------------------
	$btnStep4N.addEventListener("click", function () {
		if(step5IsSet)return;
		step5IsSet = true;
		const $object1 = document.getElementById('select-object-1');
		const $object2 = document.getElementById('select-object-2');
		const $calcul = document.getElementById('calcul');
		const $periodHead = document.getElementById('indices-period-head');
		const $periodBody = document.getElementById('indices-period-body');
		const $criteriaHead = document.getElementById('indices-criteria-head');
		const $criteriaBody = document.getElementById('indices-criteria-body');
		const objectsNames = dataEntry.getObjectsNames();
		const $option = document.createElement("option");
		let sI1 = 1 , sI2 = 0; 
		objectsNames.forEach(name => {
			const $option = document.createElement("option");
			$option.innerText = name;
			$option.value = name;
			$object1.appendChild($option.cloneNode(true));
			$object2.appendChild($option);
		});
		$object1.options[0].selected = true;
		$object2.options[1].selected = true;
		// $object2.options[sI2].disabled = true;
		// $object1.options[sI1].disabled = true;
		$object1.addEventListener("change", function () {
			sI1 = getOptionIndex($object1);
			if(sI1==sI2){
				sI2=sI2+1<$object2.options.length?sI2+1:sI2-1;
				console.log("obect 1 change 2??");
				console.log($object2.value);
				console.log($object2.options[sI2].value);
				$object2.value = $object2.options[sI2].value;
				console.log($object2.value);
				console.log("###################");
			}
			calcul();
		});
		$object2.addEventListener("change", function () {
			sI2 = getOptionIndex($object2);
			if(sI2==sI1){
				sI1=sI1+1<$object2.options.length?sI1+1:sI1-1;
				console.log("obect 2 change 1??");
				console.log($object1.value);
				console.log($object1.options[sI1].value);
				$object1.value = $object1.options[sI1].value;
				console.log($object1.value);
				console.log("###################");
			}
			calcul();
		});
		function calcul(){
			const indices = dataEntry.getIndices($object1.value, $object2.value);
			setTable($criteriaHead, $criteriaBody , indices.byCriteria, indices.criteria);
			setTable($periodHead, $periodBody , indices.byPeriod, indices.period);
		}
		calcul();
		function creatcCell(elem, value) {
			const $elem = document.createElement(elem);
			$elem.innerText = value;
			return $elem;
		}
		function setTable($head, $body, data, index){
			$head.innerHTML = "";
			$body.innerHTML = "";
			const $tr1 = document.createElement("tr");
			const $tr2 = document.createElement("tr");
			const $tr3 = document.createElement("tr");
			$head.appendChild(creatcCell("th", ""));
			$tr1.appendChild(creatcCell("td", "cocordance"));
			$tr2.appendChild(creatcCell("td", "discordance"));
			$tr3.appendChild(creatcCell("td", "cridible"));
			data.forEach(d=>{
				$head.appendChild(creatcCell("th", d.name));
				$tr1.appendChild(creatcCell("td", d.cocordance));
				$tr2.appendChild(creatcCell("td", d.discordance));
				$tr3.appendChild(creatcCell("td", d.cridible));
			});
			$head.appendChild(creatcCell("th", "total"));
			$tr1.appendChild(creatcCell("td", index.cocordance));
			$tr2.appendChild(creatcCell("td", index.discordance));
			$tr3.appendChild(creatcCell("td", index.cridible));
			$body.appendChild($tr1);
			$body.appendChild($tr2);
			$body.appendChild($tr3);
			
		}
		function getOptionIndex($select) {
			let i = 0;
			for(const opt of $select.options){
				if(opt.selected){
					return i ;
				}
				i++;
			}
		}
	});
	// window.onbeforeunload = function(e) {
	// 	//if(isSaved)return null;
	// 	console.log(e);
	// 	e.preventDefault()
	// 	return "Are you sure?";
	// };

	function initStorage() {
		return false;
		let toSaveData = false;
		let hasRestore = false;
		if (localStorage) {
			const lastDataEntry = localStorage.getItem('lastDataEntry1');
			if (lastDataEntry) {
				console.log('Last', lastDataEntry);
				dataEntry.create(lastDataEntry);
				$section.setAttribute("data-step", 4);
				$storageNew.disabled = false;
				hasRestore = true;
			}
			$storageRestore.addEventListener("click", function () {
				dataEntry.create(lastDataEntry);
				$section.setAttribute("data-step", 4);
				$storageNew.disabled = false;
				hasRestore = true;
			});
			$storageSave.addEventListener("click", function () {
				$storageSave.disabled = true;
				localStorage.setItem('lastDataEntry1', dataEntry.stringify());
				$storageRestore.disabled = true;
			});
		}
		else {
			console.log("is enabled to save data");
		}
		$storageNew.addEventListener("click", function () {
			dataEntry.reset();
			if (hasRestore) {
				$storageRestore.disabled = false;
				$storageNew.disabled = true;
			}
			$section.setAttribute("data-step", 1);
		});
		return hasRestore;
	}
	
	function initNavigation() {
		const $btnNavigations = document.querySelectorAll('.navigation');
		let transitionEnd = true;
		for (const $btn of $btnNavigations) {
			const dir = $btn.getAttribute("data-direction");
			$btn.addEventListener("click", function () {
				if (!transitionEnd)
					return;
				transitionEnd = false;
				$section.className = `steps ${dir}`;
				setTimeout(() => {
					$section.setAttribute("data-step", $btn.value);
					setTimeout(() => {
						transitionEnd = true;
					}, 500);
				}, 50);
			});
		}
	}
	
	function initStep1(){
		const $sizes = document.querySelectorAll('.input-size');
		for (const $size of $sizes) {
			$size.addEventListener("change", function () {
				dataEntry.setSize($size.getAttribute("data-size"), parseInt($size.value));
				$btnStep1.disabled = !dataEntry.sizesIsSet();
			});
		}
	}
	function intiStep2() {
		const $inputObjectName = document.getElementById('input-object-name');
		const $inputPeriodName = document.getElementById('input-period-name');
		const $inputPeriodWeight = document.getElementById('input-period-weight');
		const $inputCriteriaName = document.getElementById('input-criteria-name');
		const $inputCriteriaWeight = document.getElementById('input-criteria-weight');
		const $inputCriteriaMethod = document.getElementById('input-criteria-method');
		const $addInfoBtns = document.querySelectorAll('.add-info');
		for (const $btn of $addInfoBtns) {
			$btn.addEventListener("click", function () {
				const attr = $btn.value;
				switch (attr) {
					case "object":
						setDataHeaderObject($btn);
						break;
					case "period":
						setDataHeaderPeriod($btn);
						break;
					case "criteria":
						setDataHeaderCriteria($btn);
						break;
					default:
						break;
				}
				$btnStep2P.disabled = true;
				if (dataEntry.attributesIsSet()) {
					$btnStep2N.disabled = false;
				}
			});
		}
		$btnStep1.addEventListener("click", function () {
			const {period, object, criteria} = dataEntry.getSizes();
			let cellWidth;
			if(period<20 && object<20 && criteria<20){
				cellWidth = 96;
			}else{
				document.body.className = "small";
				cellWidth = 48;
			}
			criteriaWidth = criteria * cellWidth;
			objectWidth = object * cellWidth;
			periodWidth = period * cellWidth;			
			$objectHeaderTable.style.width = `${objectWidth}px`;
			$periodHeaderTable.style.width = `${periodWidth}px`;
			$criteriaHeaderTable.style.width = `${criteriaWidth}px`;
			criteriaWidth += cellWidth;
			objectWidth += cellWidth;
			periodWidth += cellWidth;
		});
		function setDataHeaderObject($btn) {
			const name = $inputObjectName.value;
			const data = { name };
			if (dataEntry.addObject(data)) {
				addDataHeaderElement($objectHeaderTable, data);
				$inputObjectName.value = "";
				$btn.disabled = dataEntry.objectsAttributeIsSet();
			}
		}
		function setDataHeaderPeriod($btn) {
			const name = $inputPeriodName.value;
			const weight = $inputPeriodWeight.value;
			const data = { name, weight };
			if (dataEntry.addPeriod(data)) {
				addDataHeaderElement($periodHeaderTable, data);
				$inputPeriodName.value = "";
				$inputPeriodWeight.value = "";
				$btn.disabled = dataEntry.periodsAttributeIsSet();
			}
		}
		function setDataHeaderCriteria($btn) {
			const name = $inputCriteriaName.value;
			const weight = $inputCriteriaWeight.value;
			const method = $inputCriteriaMethod.value;
			const data = { name, weight, method };
			if (dataEntry.addCriteria(data)) {
				addDataHeaderElement($criteriaHeaderTable, data);
				$inputCriteriaName.value = "";
				$inputCriteriaWeight.value = "";
				$inputCriteriaMethod.value = "";
				$btn.disabled = dataEntry.criteriasAttributeIsSet();
			}
		}
		function addDataHeaderElement($element, data) {
			const $span = document.createElement("span");
			$span.className = "row";
			const method = data.method ? (data.method < 0 ? "-" : data.method > 0 ? "+" : "=") : "";
			const weight = data.weight ? data.weight : "";
			$span.innerHTML = `
					<span>${data.name}</span>
					<span>${weight}</span>
					<span>${method}</span>
					`;
			// $span.addEventListener("click",getRemoveDataHeader($element));
			$span.title = data.name;
			$element.appendChild($span);
		}
	}
	function initStep3() {
		$btnStep2N.addEventListener("click", function () {
			if (step3IsSet)
				return;
			step3IsSet = true;
			const $periodName = document.getElementById('period-name');
			const $entryHeader = document.getElementById('entry-header-table');
			const $entryObjectName = document.getElementById('object-name');
			const $entryInputs = document.getElementById('entry-input-table');
			const $entryDataLines = document.getElementById('lines');
			const $btnAddLine = document.getElementById('add-line');
			const $btnAddPeriod = document.getElementById('add-period');
			let currentPeriod = null;
			let currentObject = null;
			dataEntry.resetPeriodIndex();
			const criterias = dataEntry.getCriteriasNames();
			for (const criteria of criterias) {
				const $span = document.createElement("span");
				$span.className = "row";
				$span.innerText = criteria;
				$span.title = criteria;
				$entryHeader.appendChild($span);
			}
			$entryHeader.style.width = `${criteriaWidth}px`;
			$entryInputs.style.width = `${criteriaWidth}px`;
			displayNextPeriodDataEntry();
			function displayNextPeriodDataEntry() {
				if (dataEntry.hasNextPeriod()) {
					console.log("has next period");
					displayCurrentPeriodEntry();
					$btnAddLine.disabled = false;
					$btnAddPeriod.disabled = true;
				}
				else {
					$btnAddLine.disabled = true;
					$btnAddPeriod.disabled = true;
					$btnStep3N.disabled = false;
				}
			}
			function displayCurrentPeriodEntry() {
				currentPeriod = dataEntry.getPeriod();
				displayPeriodData();
				initInputsEntry();
			}
			function initInputsEntry() {
				$entryInputs.innerHTML = "";
				if (dataEntry.hasNextObject()) {
					currentObject = dataEntry.getObject();
					const criteriaNbr = dataEntry.getSizes().criteria;
					$entryObjectName.innerText = currentObject.name;
					$entryObjectName.title = currentObject.name;
					$entryInputs.appendChild($entryObjectName);
					for (let i = 0; i < criteriaNbr; i++) {
						const $input = document.createElement("input");
						$input.className = "row";
						$input.type = "number";
						$input.step = 0.01;
						$entryInputs.appendChild($input);
					}
					$btnAddLine.disabled = false;
					$btnAddPeriod.disabled = true;
				}
				else {
					$btnAddLine.disabled = true;
					$btnAddPeriod.disabled = false;
				}
			}
			function displayPeriodData() {
				$entryDataLines.innerHTML = "";
				$periodName.innerText = currentPeriod.name;
				const values = dataEntry.getData({ period: currentPeriod.name });
				dataEntry.resetObjectIndex();
				for (const value of values) {
					if (value[0] === null)
						break;
					dataEntry.hasNextObject();
					currentObject = dataEntry.getObject();
					const $line = document.createElement("div");
					$line.className = "line";
					const $span = document.createElement("span");
					$span.className = "row";
					$span.innerText = currentObject.name;
					$span.title = currentObject.name;
					$line.appendChild($span);
					for (const v of value) {
						const $span = document.createElement("span");
						$span.className = "row";
						$span.innerText = v;
						$span.title = v;
						$line.appendChild($span);
					}
					$line.style.width = `${criteriaWidth}px`;
					$entryDataLines.appendChild($line);
				}
			}
			function getCriterias() {
				const $inputs = $entryInputs.querySelectorAll("input");
				const critrias = [];
				for (const $input of $inputs) {
					if ($input.valueAsNumber) {
						critrias.push($input.valueAsNumber);
					}
					else {
						return null;
					}
				}
				return critrias;
			}
			// function displayNewPeriodEntry(criterias) {
			// }
			$btnAddLine.addEventListener("click", function () {
				$btnStep3P.disabled = true;
				const criterias = getCriterias();
				if (criterias) {
					dataEntry.setData(currentPeriod.name, currentObject.name, criterias);
					displayCurrentPeriodEntry();
					//displayNewPeriodEntry(criterias);
				}
			});
			$btnAddPeriod.addEventListener("click", function () {
				displayNextPeriodDataEntry();
			});
		});
	}
});




