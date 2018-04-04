function get$() {
	const $ = {};
	$.modal = document.getElementById('modal');
	$.cancel = document.getElementById('cancel');
	$.newCoreta = document.getElementById('new-coreta');

	$.btnAddObject = document.getElementById('btn-add-object');
	$.inAddObject = document.getElementById('in-add-object');
	$.outAddObject = document.getElementById('out-add-object');

	$.btnAddCriteria = document.getElementById('btn-add-criteria');
	$.inAddCriteriaName = document.getElementById('in-add-criteria-name');
	$.inAddCriteriaWeight = document.getElementById('in-add-criteria-weight');
	$.inAddCriteriaMethod = document.getElementById('in-add-criteria-method');
	$.outAddCriteria = document.getElementById('out-add-criteria');

	$.btnAddPeriod = document.getElementById('btn-add-period');
	$.inAddPeriodName = document.getElementById('in-add-period-name');
	$.inAddPeriodWeight = document.getElementById('in-add-period-weight');
	$.outAddPeriod = document.getElementById('out-add-period');
	return $;
}
function getFn($) {
	const fn = {};
	initModal($, fn);
	initAddAttributesNames($, fn);
	return fn;
}
function setEvents($, fn) {
	initAddAttributesNamesEvent($, fn);
}
function initAddAttributesNamesEvent($, fn) {
	$.btnAddObject.addEventListener("click", getAddAttributeFunction(fn.getObject, fn.addObject));
	$.btnAddPeriod.addEventListener("click", getAddAttributeFunction(fn.getPeriod, fn.addPeriod));
	$.btnAddCriteria.addEventListener("click", getAddAttributeFunction(fn.getCriteria, fn.addCriteria));
	function getAddAttributeFunction(get, add) {
		return function addAttribute() {
			const input = get();
			add(input, false);
		}
	}
}
function initModal($, fn) {
	fn.startNewCoreta = function startNewCoreta() {
		$.modal.style.display = "block";
		$.modal.setAttribute("data-modal", 1);
		setTimeout(() => {
			$.modal.className = "modals show";
		},50);
	}
	fn.closeModal = function closeModal($) {
		$.modal.style.display = "";
	}
}
function initAddAttributesNames($, fn){
	fn.getObject = getGetInputsFunction([$.inAddObject]);
	fn.addObject = getAddFunction($.btnAddObject, $.outAddObject);
	fn.getCriteria = getGetInputsFunction([$.inAddCriteriaName,$.inAddCriteriaWeight,$.inAddCriteriaMethod]);
	fn.addCriteria = getAddFunction($.btnAddCriteria, $.outAddCriteria);
	fn.getPeriod = getGetInputsFunction([$.inAddPeriodName, $.inAddPeriodWeight]);
	fn.addPeriod = getAddFunction($.btnAddPeriod, $.outAddPeriod);
	function getAddFunction($btn, $out) {
		return function addFunction(inputs, end) {
			const spans = [];
			for (const key in inputs) {
				spans.push(createElement('span',inputs[key]))
			}
			const $td = createElement("td", spans);
			$out.appendChild($td);
			if(end){
				$btn.disabled = true;
			}
		}
	}
	function getGetInputsFunction($inputs) {
		return function getInputs() {
			const inputs = {};
			$inputs.forEach($input => {
				inputs[$input.getAttribute("data-attribute")] = $input.value;
			});
			return inputs;
		}
	}
}
function createElement(elem, ctns) {
	const $elem = document.createElement(elem);
	if(Array.isArray(ctns)){
		ctns.forEach(ctn => {
			$elem.appendChild(ctn);
		});
	}else{
		$elem.innerText = ctns;
	}
	return $elem;
}

window.addEventListener("load", function () {
	const coreta = {};
	coreta.$ = get$();
	coreta.fn = getFn(coreta.$);
	setEvents(coreta.$, coreta.fn);
	setTimeout(() => {
		//coreta.fn.startNewCoreta();
	}, 5000);
});