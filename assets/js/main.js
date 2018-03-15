window.addEventListener("load", function () {
    
    const dataEntry = new DataEntry;
    window.dataEntry = dataEntry
    const $section = document.querySelector('.steps');
    let periodWidth, objectWidth, criteriaWidth;
    // navigation ----------------------------------------------------------
    const $btnNavigations = document.querySelectorAll('.navigation');
    let transitionEnd = true;
    for (const $btn of $btnNavigations) {
        const step = $btn.value;
        const dir = $btn.getAttribute("data-direction");
        $btn.addEventListener("click", function () {
            if(!transitionEnd) return;
            transitionEnd = false;
            $section.className = `steps ${dir}`;
            setTimeout(() => {
                $section.setAttribute("data-step",step);
                setTimeout(() => {
                    transitionEnd = true;
                }, 500);
            }, 50);
        })
    }

    // step 1 ----------------------------------------------------------
    const $btnStep1 = document.getElementById('btn-step-1');
    const $sizes = document.querySelectorAll('.input-size');
    for (const $size of $sizes) {
        $size.addEventListener("change", function () {
            dataEntry.setSize($size.getAttribute("data-size"), parseInt($size.value));
            const {period, object, criteria} = dataEntry.getSizes();
            if(period<20 && object<20 && criteria<20){
                periodWidth = period * 96;
                objectWidth = object * 96;
                criteriaWidth = criteria * 96;
            }else{
                document.body.className = "small";
                periodWidth = period * 48;
                objectWidth = object * 48;
                criteriaWidth = criteria * 48;
            }
            $objectHeaderTable.style.width = `${objectWidth}px`;
            $periodHeaderTable.style.width = `${periodWidth}px`;
            $criteriaHeaderTable.style.width = `${criteriaWidth}px`;
            $btnStep1.disabled = !dataEntry.sizesIsSet();
        });
    }

    // step 2 -----------------------------------------------------------
    const $btnStep2N = document.getElementById('btn-step-2-n');
    const $btnStep2P = document.getElementById('btn-step-2-p');
    const $addInfoBtns = document.querySelectorAll('.add-info');
    for (const $btn of $addInfoBtns) {
        $btn.addEventListener("click",function () {
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
            if(dataEntry.isCriteriaFull()&&dataEntry.isObjectFull()&&dataEntry.isPeriodFull()){
                    $btnStep2N.disabled = false;
            }
        })
    }
    const $inputObjectName = document.getElementById('input-object-name');
    const $objectHeaderTable = document.getElementById('object-header-table');

    const $inputPeriodName = document.getElementById('input-period-name');
    const $inputPeriodWeight = document.getElementById('input-period-weight');
    const $periodHeaderTable = document.getElementById('period-header-table');

    const $inputCriteriaName = document.getElementById('input-criteria-name');
    const $inputCriteriaWeight = document.getElementById('input-criteria-weight');
    const $inputCriteriaMethod = document.getElementById('input-criteria-method');
    const $criteriaHeaderTable = document.getElementById('criteria-header-table');

    function setDataHeaderObject($btn) {
        const name = $inputObjectName.value;
        const data = {name};
        if(dataEntry.addObject(data)){
            addDataHeaderElement($objectHeaderTable, data);
            $inputObjectName.value = "";
            $btn.disabled = dataEntry.isObjectFull();

        }
        
    }
    function setDataHeaderPeriod($btn) {
        const name = $inputPeriodName.value;
        const weight = $inputPeriodWeight.value;
        const data = { name, weight};
        if(dataEntry.addPeriod(data)){
            addDataHeaderElement($periodHeaderTable, data);
            $inputPeriodName.value = "";
            $inputPeriodWeight.value = "";
            $btn.disabled = dataEntry.isPeriodFull();
        }
    }
    function setDataHeaderCriteria($btn) {
        const name = $inputCriteriaName.value;
        const weight = $inputCriteriaWeight.value;
        const method = $inputCriteriaMethod.value;
        const data = { name, weight, method };
        if(dataEntry.addCriteria(data)){
            addDataHeaderElement($criteriaHeaderTable, data);
            $inputCriteriaName.value = "";
            $inputCriteriaWeight.value = "";
            $inputCriteriaMethod.value = "";
            $btn.disabled = dataEntry.isCriteriaFull();
        }
    }
    function addDataHeaderElement($element, data) {
        const $span = document.createElement("span");
        $span.className ="row";
        const method = data.method?(data.method<0?"-":data.method>0?"+":"="):"";
        const weight = data.weight?data.weight:"";
        $span.innerHTML = `
            <span>${data.name}</span>
            <span>${weight}</span>
            <span>${method}</span>
            `;
        // $span.addEventListener("click",getRemoveDataHeader($element));
        $span.title = data.name;
        $element.appendChild($span);
    }
    
    //step 3----------------------------------------------
    const $periodName = document.getElementById('period-name');
    const $entryHeader = document.getElementById('entry-header-table');
    const $entryObjectName = document.getElementById('object-name');
    const $entryInputs = document.getElementById('entry-input-table');
    const $entryDataLines = document.getElementById('lines');
    const $btnAddLine = document.getElementById('add-line');
    const $btnAddPeriod = document.getElementById('add-period');
    const $btnStep3N = document.getElementById('btn-step-3-n');
    const $btnStep3P = document.getElementById('btn-step-3-p');
    let currentPeriod = null;
    let currentObject = null;
    $btnStep2N.addEventListener("click", function () {

        dataEntry.resetPeriodIndex();
        dataEntry.resetObjectIndex();
        currentPeriod = dataEntry.getPeriod();
        setEntryDataInputs();

        const criterias = dataEntry.getCriteriasNames();
        for (const criteria of criterias) {
            const $span = document.createElement("span");
            $span.className ="row";
            $span.innerText = criteria;
            $span.title = criteria;
            $entryHeader.appendChild($span);
            $entryHeader.style.width = `${criteriaWidth+96}px`;
        }
    });
    function setEntryDataInputs() {
        if(dataEntry.hasObject()){
            $periodName.innerText = currentPeriod.name;
            dataEntry.resetObjectIndex();
            setEntryData();
            setEntryInputs();
            $btnAddLine.disabled = false;
            $btnAddPeriod.disabled = true;
        }else{
            if(dataEntry.hasPeriod()){
                currentPeriod = dataEntry.getPeriod();
                dataEntry.resetObjectIndex();
                $btnAddLine.disabled=true;
                $btnAddPeriod.disabled = false;
            }else{
                $btnAddLine.disabled=true;
                $btnAddPeriod.disabled = true;
                $btnStep3N.disabled = false;
            }
        }
    }
    function setEntryInputs() {
            currentObject = dataEntry.getObject();
            const criteriaNbr = dataEntry.getSizes().criteria;
            $entryInputs.innerHTML = "";
            $entryObjectName.innerText = currentObject.name;
            $entryObjectName.title = currentObject.name;
            $entryInputs.appendChild($entryObjectName);
            for (let i = 0; i < criteriaNbr; i++) {
                const $input = document.createElement("input");
                $input.className ="row";
                $input.type = "number";
                $input.step = 0.01;
                $entryInputs.appendChild($input);
                $entryInputs.style.width = `${criteriaWidth+96}px`;
            }
    }
    function setEntryData() {
        const objectsCriterias = dataEntry.getObjectsCriteriasByPeriod(currentPeriod.name);
        $entryDataLines.innerHTML = "";
        for (let i = 0; i < objectsCriterias.length; i++) {
            const criterias = objectsCriterias[i];
            const object = dataEntry.getObject();
            const $span = document.createElement("span");
            $span.className = "row";
            const $line = document.createElement("div");
            $line.className = "line";
            $span.innerText = object.name;
            $line.appendChild($span);
            for (let j = 0; j < criterias.length; j++) {
                const criteria = criterias[j];
                const $span = document.createElement("span");
                $span.className = "row";
                $span.innerText = criteria;
                $span.title = criteria;
                $line.appendChild($span);
                $line.style.width = `${criteriaWidth+96}px`;
            }
            $entryDataLines.appendChild($line);
        }
    }
    $btnAddLine.addEventListener("click",function () {
        $btnStep3P.disabled = true;
        const criterias = getCriterias();
        if(criterias){
            dataEntry.addCriterias(currentObject.name, currentPeriod.name, criterias);
            setEntryDataInputs();
        }
    });
    $btnAddPeriod.addEventListener("click", function() {
        setEntryDataInputs();
    });
    function getCriterias(){
        const $inputs = $entryInputs.querySelectorAll("input");
        const critrias = [];
        for (const $input of $inputs) {
            if($input.valueAsNumber){
                critrias.push($input.valueAsNumber);
            }else{
                return null;
            }
        }
        return critrias;
    }
    
    // step 4 -------------------------------------------------
    $btnStep3N.addEventListener("click", function () {
        dataEntry.save();
    })
})



