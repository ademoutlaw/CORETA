$(function (e) {
    const coreta = new Coreta;
    window.coreta = coreta;
    showModals();
    // modals
    let cancelIsAllow = false;

    function showModals() {
        if (coreta.started) {
            cancelIsAllow = true;
            $(".restore-coreta").prop("disabled", !coreta.hasStorage);
            // TODO
            showModal(3);
        } else {
            if (coreta.hasStorage) {
                showModal(2);
            } else {
                $("#back").prop("disabled", true);
                showModal(1);
            }
        }
    }

    function showModal(i) {
        const $modalContainer = $("#modal-container");
        $modalContainer.css("display", "block");
        $modalContainer.attr("data-modal", i);
        setTimeout(() => {
            $modalContainer.addClass("show");
        }, 50);
    }

    function closeModal() {
        const $modalContainer = $("#modal-container");
        setTimeout(() => {
            $modalContainer.css("display", "");
        }, 100);
        $modalContainer.removeClass("show");
    }

    function alertModal() {
        const $modalContainer = $("#modal-container");
        $modalContainer.addClass("alert");
        setTimeout(() => {
            $modalContainer.removeClass("alert");
        }, 1000);
    }
    let $editingAttributeElem;
    let editingAttributeType;
    let $editingDataElem;
    let $editingLamdaElem;
    let editingLamdaType;
    let editingI;
    let editingJ;

    function showEditAttributeModal($elem, attribute, type) {
        $editingAttributeElem = $elem;
        editingAttributeType = type;
        $edit = $("#edit-attribute-modal");
        $("#edit-in-name").val(attribute.name);
        $edit.removeClass("set-weight set-method");
        if (attribute.weight) {
            $edit.addClass("set-weight");
            $("#edit-in-weight").val(attribute.weight);
        }
        if (attribute.method) {
            $edit.addClass("set-method");
            $("#edit-in-method").val(attribute.method);
        }
        cancelIsAllow = true;
        showModal(4);
    }
    
    function showEditDataModal(i, j, $td) {
        $editingDataElem = $td;
        editingI = i;
        editingJ = j;
        $("#edit-in-data").val($td.text());
        cancelIsAllow = true;
        showModal(5);
    }
    function showEditLamdaModal($elem, type) {
        $editingLamdaElem = $elem;
        editingLamdaType = type;
        $("#edit-in-lamda").val($elem.text());
        cancelIsAllow = true;
        showModal(6);
    }
    $(".storage").click(function () {
        showModals();
    });
    const $modalContainer = document.getElementById('modal-container');
    $modalContainer.addEventListener("click", function (e) {
        if (e.target !== $modalContainer) return;
        if (cancelIsAllow) {
            closeModal();
        } else {
            alertModal();
        }
    });
    $("#new-coreta").click(function () {
        const $inputSizeAction = document.getElementById('size-action');
        const $inputSizePeriod = document.getElementById('size-period');
        const $inputSizeCriteria = document.getElementById('size-criteria');
        if ($inputSizeAction.value == "" || $inputSizePeriod.value == "" || $inputSizeCriteria.value == "") return;
        if (coreta.setSize($inputSizePeriod.value, $inputSizeAction.value, $inputSizeCriteria.value)) {
            navigate(1, "left");
            resetAttributes();
            closeModal();
        }
    });
    $(".restore-coreta").click(function () {
        coreta.restore();
        setAttributes();
        closeModal();
    });
    $(".get-new-coreta-modal").click(function () {
        $("#back").attr("data-from", 2);
        $("#back").prop("disabled", false);
        showModal(1);
    });
    $("#back").click(function () {
        showModal($(this).data("from"));
    })
    $(".cancel").click(function () {
        closeModal();
    });
    $("#ok-edit-attribute").click(function () {
        const index = $editingAttributeElem.index();
        const name = $("#edit-in-name").val();
        const weight = $("#edit-in-weight").val();
        const method = $("#edit-in-method").val();
        switch (editingAttributeType) {
            case "action":
                if (coreta.setActionAttributes(index, name)) {
                    $editingAttributeElem.replaceWith(`<td>${name}</td>`);
                    closeModal();
                }
                break;
            case "period":
                if (coreta.setPeriodAttributes(index, name, weight)) {
                    $editingAttributeElem.replaceWith(`<td><span>${name}</span><span>${weight}</span></td>`);
                    closeModal();
                }
                break;
            case "criteria":
                if (coreta.setCriteriaAttributes(index, name, weight, method)) {
                    const methodString = {
                        "1": "max",
                        "-1": "min",
                        "0": "nominal"
                    };
                    $editingAttributeElem
                        .replaceWith(`<td><span>${name}</span><span>${weight}</span><span>${methodString[method]}</span></td>`);
                    closeModal();
                }
                break;
            default:
                break;
        }
    });
    $("#ok-edit-data").click(function () {
        setDisplayData(editingI, editingJ, $("#edit-in-data").val());
        closeModal();
    });
    $("#ok-edit-lamda").click(function () {
        updateLamda($editingLamdaElem, editingLamdaType, $("#edit-in-lamda").val());
        closeModal();
    });
    $("#save-coreta").click(function () {
        coreta.save();
        closeModal();
    });
    // navigation
    let transitionEnd = true;

    function navigate(step, dir) {
        if (!transitionEnd) return;
        transitionEnd = false;
        $section = document.querySelector('.steps');
        $section.className = `steps ${dir}`;
        setTimeout(() => {
            $section.setAttribute("data-step", step);
            setTimeout(() => {
                transitionEnd = true;
            }, 500);
        }, 50);
    }

    // step 1
    function addAction(name, exist = false) {
        if (exist || coreta.addActionAttributes(name)) {
            const $table = $("#add-action table");
            let w = $table.width();
            w += coreta.getActionSize() < 20 ? 96 : 48;
            $table.width(w);
            $('#out-add-action').append(`<td>${name}</td>`);
            $("#in-add-action").val("");
            $("#in-add-action").focus();
            if (coreta.actionAttributesIsSet()) {
                $("#add-action").addClass('no-form');
                if (coreta.periodAttributesIsSet() && coreta.criteriaAttributesIsSet()) {
                    $("#btn-step1-next").prop("disabled", false);
                }
            }
        }
    }
    function addPeriod(name, weight, exist = false) {
        if (exist || coreta.addPeriodAttributes(name, weight)) {
            const $table = $("#add-period table");
            let w = $table.width();
            w += coreta.getPeriodSize() < 20 ? 96 : 48;
            $table.width(w);
            $('#out-add-period').append(`<td><span>${name}</span><span>${weight}</span></td>`);
            $("#in-add-period-name").val("");
            $("#in-add-period-weight").val("");
            $("#in-add-period-name").focus();
            if (coreta.periodAttributesIsSet()) {
                $("#add-period").addClass('no-form');
                if (coreta.actionAttributesIsSet() && coreta.criteriaAttributesIsSet()) {
                    $("#btn-step1-next").prop("disabled", false);
                }
            }
        }
    }
    function addCriteria(name, weight, method, exist = false) {
        if (exist || coreta.addCriteriaAttributes(name, weight, method)) {
            const $table = $("#add-criteria table");
            let w = $table.width();
            w += coreta.getCriteriaSize() < 20 ? 96 : 48;
            $table.width(w);
            const methodString = {
                "1": "max",
                "-1": "min",
                "0": "nominal"
            };
            $('#out-add-criteria')
                .append(`<td><span>${name}</span><span>${weight}</span><span>${methodString[method]}</span></td>`);
            $("#in-add-criteria-name").val("");
            $("#in-add-criteria-weight").val("");
            $("#in-add-criteria-method").val("");
            $("#in-add-criteria-name").focus();
            if (coreta.criteriaAttributesIsSet()) {
                $("#add-criteria").addClass('no-form');
                if (coreta.periodAttributesIsSet() && coreta.actionAttributesIsSet()) {
                    $("#btn-step1-next").prop("disabled", false);
                }
            }
        }
    }
    function resetAttributes() {
        $("#btn-step1-next").prop("disabled", true);
        $('#out-add-action').html("");
        $('#out-add-period').html("");
        $('#out-add-criteria').html("");
        $("#add-action").removeClass('no-form');
        $("#add-period").removeClass('no-form');
        $("#add-criteria").removeClass('no-form');
        $("#add-action table").css("width", "");
        $("#add-period table").css("width", "");
        $("#add-criteria table").css("width", "");
    }
    function setAttributes() {
        resetAttributes();
        const actions = coreta.getActionsAttributes();
        const periods = coreta.getPeriodsAttributes();
        const criterias = coreta.getCriteriasAttributes();
        actions.forEach(action => {
            addAction(action.name, true);
        });
        periods.forEach(period => {
            addPeriod(period.name, period.weight, true);
        });
        criterias.forEach(criteria => {
            addCriteria(criteria.name, criteria.weight, criteria.method, true);
        });
    }

    $("#btn-add-action").click(function () {
        const val = $("#in-add-action").val();
        addAction(val);
    });
    $("#btn-add-period").click(function () {
        const name = $("#in-add-period-name").val();
        const weight = $("#in-add-period-weight").val();
        addPeriod(name, weight);
    });
    $("#btn-add-criteria").click(function () {
        const name = $("#in-add-criteria-name").val();
        const weight = $("#in-add-criteria-weight").val();
        const method = $("#in-add-criteria-method").val();
        addCriteria(name, weight, method);
    });

    $("#out-add-action").on("click", "td", function () {
        const action = coreta.getActionAttributes($(this).index());
        showEditAttributeModal($(this), action, "action");
    });
    $("#out-add-period").on("click", "td", function () {
        const period = coreta.getPeriodAttributes($(this).index());
        showEditAttributeModal($(this), period, "period");
    });
    $("#out-add-criteria").on("click", "td", function () {
        const criteria = coreta.getCriteriaAttributes($(this).index());
        showEditAttributeModal($(this), criteria, "criteria");
    });
    $("#btn-step1-next").click(function () {
        // const dir = $(this).data("direction");
        // const step = $(this).val();
        setLamdas();
        navigate(2, "left");
    });

    // step 2
    function addLamda(val, exist = false) {
        if (exist || coreta.addLamda(val)) {
            const $table = $("#add-lamda table");
            let w = $table.width();
            w += coreta.getCriteriaSize() < 20 ? 96 : 48;
            $table.width(w);
            $('#out-add-lamda').append(`<td>${val}</td>`);
            $("#in-add-lamda").val("");
            $("#in-add-lamda").focus();
            if (coreta.lamdaIsSet()) {
                $("#add-lamda").addClass('no-form');
                if(coreta.lamdaGlobalIsSet()){
                    console.log("is setttttt");
                    $("#btn-step2-next").prop("disabled", false);
                }
            }
        }
    }
    function setLamdaGlobal(val) {
        if (coreta.setLamdaGlobal(val)) {
            $('#out-add-lamda-g').html("").append(`<span>${val}</span>`);
            $("#add-lamda-g").addClass('no-form');
            if (coreta.lamdaIsSet()) {
                $("#btn-step2-next").prop("disabled", false);
            }
        }
    }
    function setLamdas() {
        console.error("setLamda");
        const lamdas = coreta.getLamdas();
        const lamdaG = coreta.getLamdaGlobal();
        $('#btn-step2-next').prop("disabled", true);
        $('#out-add-lamda').html("");
        $('#add-lamda table').css("width", "");
        const $table = $("#add-lamda table");
        const wd = coreta.getCriteriaSize() < 20 ? 96 : 48;
        let w = $table.width();
        lamdas.forEach(function (lamda) {
            $('#out-add-lamda').append(`<td>${lamda}</td>`);
            w += wd;
        });
        $table.width(w);
        if(lamdaG){
            $("#add-lamda-g").addClass('no-form');
            $('#out-add-lamda-g').html(`<span>${lamdaG}</span>`);
        }else{
            $("#add-lamda-g").removeClass('no-form');
        }
        if (coreta.lamdaIsSet()) {
            $("#add-lamda").addClass('no-form');
            if(coreta.lamdaGlobalIsSet()){
                $("#btn-step2-next").prop("disabled", false);
            }
        }else{
            $("#add-lamda").removeClass('no-form');
        }
    }
    function updateLamda($elem, type, lamda) {
        $elem.html(lamda);
        if(type=="lamda"){
            const index = $elem.index();
            coreta.setLamda(index, lamda);
        }else{
            coreta.setLamdaGlobal(lamda);
        }
    }
    $("#btn-add-lamda").click(function () {
        const val = $("#in-add-lamda").val();
        addLamda(val);
    });
    $("#btn-add-lamda-g").click(function () {
        const val = $("#in-add-lamda-g").val();
        setLamdaGlobal(val);
    });
    $("#btn-step2-prev").click(function () {
        navigate(1, "right");
    });
    $("#btn-step2-next").click(function () {
        setRhos();
        navigate(3, "left");
    });
    $('#out-add-lamda-g').on("click","span",function () {
        showEditLamdaModal($(this), "lamdaG");
    });
    $('#add-lamda').on("click","td",function () {
        showEditLamdaModal($(this), "lamda");
    });

    // step 3
    function addRho(val, exist = false) {
        if (exist || coreta.addRho(val)) {
            const $table = $("#add-rho table");
            let w = $table.width();
            w += coreta.getActionSize() < 20 ? 96 : 48;
            $table.width(w);
            $('#out-add-rho').append(`<td>${val}</td>`);
            $("#in-add-rho").val("").focus();
            if (coreta.rhoIsSet()) {
                console.log("yessss");
                $("#add-rho").addClass('no-form');
                if(coreta.rhoGlobalIsSet()){
                    console.log("is setttttt");
                    $("#btn-step3-next").prop("disabled", false);
                }
            }
        }
    }
    function setRhoGlobal(val) {
        if (coreta.setRhoGlobal(val)) {
            $('#out-add-rho-g').html("").append(`<span>${val}</span>`);
            $("#add-rho-g").addClass('no-form');
            if (coreta.rhoIsSet()) {
                $("#btn-step3-next").prop("disabled", false);
            }
        }
    }
    function setRhos() {
        const rhos = coreta.getRhos();
        const rhoG = coreta.getRhoGlobal();
        $('#btn-step3-next').prop("disabled", true);
        $('#out-add-rho').html("");
        $('#add-rho table').css("width", "");
        const $table = $("#add-rho table");
        const wd = coreta.getActionSize() < 20 ? 96 : 48;
        let w = $table.width();
        rhos.forEach(function (rho) {
            $('#out-add-rho').append(`<td>${rho}</td>`);
            w += wd;
        });
        $table.width(w);
        if(rhoG){
            $("#add-rho-g").addClass('no-form');
            $('#out-add-rho-g').html(`<span>${rhoG}</span>`);
        }else{
            $("#add-rho-g").removeClass('no-form');
        }
        if (coreta.rhoIsSet()) {
            $("#add-rho").addClass('no-form');
            if(coreta.rhoGlobalIsSet()){
                $("#btn-step3-next").prop("disabled", false);
            }
        }else{
            $("#add-rho").removeClass('no-form');
        }
    }
    function updateRho($elem, type, rho) {
        $elem.html(rho);
        if(type=="rho"){
            const index = $elem.index();
            coreta.setRho(index, rho);
        }else{
            coreta.setRhoGlobal(rho);
        }
    }
    $("#btn-add-rho").click(function () {
        const val = $("#in-add-rho").val();
        addRho(val);
    });
    $("#btn-add-rho-g").click(function () {
        const val = $("#in-add-rho-g").val();
        setRhoGlobal(val);
    });
    $("#btn-step3-prev").click(function () {
        navigate(2, "right");
    });
    $("#btn-step3-next").click(function () {
        // const dir = $(this).data("direction");
        // const step = $(this).val();
        if (restoreEntryData()) {
            $('#btn-step2-next').prop("disabled", true);
            navigate(4, "left");
        } else {
            setDisplaySelects();
            displayData();
            navigate(5, "left");
        }
    });
    $('#out-add-rho-g').on("click","span",function () {
        showEditrhoModal($(this), "rhoG");
    });
    $('#add-rho').on("click","td",function () {
        showEditrhoModal($(this), "rho");
    });

    // step 4
    let entryPeriodIndex, entryActionIndex;
    function setEntryInputs() {
        const size = coreta.getCriteriaSize();
        const $tr = $("<tr></tr>");
        $tr.append(`<th>${coreta.getActionAttributes(entryActionIndex).name}</th>`);
        for (let i = 0; i < size; i++) {
            $tr.append(`<th><input type="number"></th>`);
        }
        $('#entry-body').append($tr);
    }
    function setEntryHeader() {
        const criterias = coreta.getCriteriasAttributes();
        const $tr = $("<tr></tr>");
        $tr.append(`<th></th>`);
        for (const criteria of criterias) {
            $tr.append(`<th>${criteria.name}</th>`);
        }
        $('#entry-head').html("").append($tr);
        setEntryPeriodLabel();
    }
    function setEntryPeriodLabel() {
        $('#entry-body').html("");
        $("#period-name").html(coreta.getPeriodAttributes(entryPeriodIndex).name);
    }
    function restoreEntryData() {
        const period = coreta.getLastPeriodNotSet();
        if (period === null) return false;
        entryPeriodIndex = period.index;
        setEntryHeader();
        let i = 0
        for (; i < period.data.length; i++) {
            if (period.data[i][0] === null) break;
            const $tr = $("<tr></tr>");
            $tr.append(`<th>${coreta.getActionAttributes(i).name}</th>`);
            for (const criteria of period.data[i]) {
                $tr.append(`<td>${criteria}</td>`);
            }
            $('#entry-body').append($tr);
        }
        entryActionIndex = i;
        setEntryInputs();
        return true;

    }
    function getEntryInputs() {
        const inputs = [];
        for (const input of $('#entry-body input')) {
            if (input.value == "") {
                return null;
            }
            inputs.push(input.value);
        }
        return inputs;
    }
    function saveEntryInputs() {
        for (const $input of $('#entry-body input')) {
            const $td = document.createElement("td");
            $td.innerText = $input.value
            $input.parentElement.replaceWith($td) ;
        }
    }
    function saveEntryData() {
        const inputs = getEntryInputs();
        if (inputs) {
            coreta.addData(entryPeriodIndex, entryActionIndex, inputs);
            entryActionIndex++;
            if (entryActionIndex < coreta.getActionSize()) {
                saveEntryInputs();
                setEntryInputs(coreta.getActionAttributes(entryActionIndex).name);
            } else {
                entryPeriodIndex++;
                if (entryPeriodIndex < coreta.getPeriodSize()) {
                    entryActionIndex = 0;
                    setEntryPeriodLabel();
                    setEntryInputs();
                } else {
                    saveEntryInputs();
                    $('#btn-add-data').prop("disabled", true);
                    $('#btn-step2-next').prop("disabled", false);
                }
            }


        }
    }
    $('#btn-add-data').click(function () {
        saveEntryData();
    });
    $('#btn-step3-next').click(function () {
        setDisplaySelects();
        displayData();
        navigate(4, "left");
    });
    $('#btn-step3-prev').click(function () {
        navigate(2, "right");
    });

    // step 4
    function setDisplaySelects() {
        const actions = coreta.getActionsAttributes();
        const periods = coreta.getPeriodsAttributes();
        const criterias = coreta.getCriteriasAttributes();
        $('#select-action').html('<option value="all">all</option>');
        actions.forEach((action, i) => {
            $('#select-action').append(`<option value="${i}">${action.name}</option>`)
        });
        $('#select-period').html('<option value="all">all</option>');
        periods.forEach((period, i) => {
            $('#select-period').append(`<option value="${i}">${period.name}</option>`)
        });
        $("#select-period option").eq(0).prop('disabled', true)
        $("#select-period option").eq(1).prop('selected', true)
        $('#select-criteria').html('<option value="all">all</option>');
        criterias.forEach((criteria, i) => {
            $('#select-criteria').append(`<option value="${i}">${criteria.name}</option>`)
        });
    }
    function limitDisplaySelects($select) {
        if ($select.val() == "all") {
            let cnt = 0;
            let $temp;
            $select.siblings('select').each(function () {
                if ($(this).val() !== "all") {
                    $temp = $(this);
                    cnt++;
                }
            });
            if (cnt === 1) {
                $temp.children(':nth-child(1)').prop("disabled", true);
            }
        } else {
            $select.siblings('select').children(':nth-child(1)').prop("disabled", false);
        }
    }
    function setDisplayHeader(attributes, heading) {
        $("#data-head").html('');
        const $tr = $('<tr></tr>');
        if (heading) {
            $tr.append('<th></th>');
        }
        attributes.forEach(attribute => {
            $tr.append(`<th>${attribute.name}</th>`)
        });
        $("#data-head").append($tr);
        console.log($("#data-head"));
    }
    function setDisplayBody(data, attributes = null) {
        $("#data-body").html('');
        if (attributes) {
            for (let i = 0; i < data.length; i++) {
                const $tr = $('<tr></tr>');
                $tr.append(`<th>${attributes[i].name}</th>`);
                for (const d of data[i]) {
                    $tr.append(`<td>${d}</td>`);
                }
                $("#data-body").append($tr);
            }
        } else {
            const $tr = $('<tr></tr>');
            for (const d of data) {
                $tr.append(`<td>${d}</td>`);
            }
            $("#data-body").append($tr);
        }
    }
    let $displaySelect;
    function setDisplayPagination($select) {
        $displaySelect = $select;
        $("#pagination").removeClass("no-pagination");
        $("#prev-view-page").prop("disabled",$displaySelect.prop('selectedIndex')<2);
        $("#next-view-page").prop("disabled",$displaySelect.prop('selectedIndex')+1>=$displaySelect.children('option').length);
    }
    function displayData() {
        const period = $('#select-period').val();
        const action = $('#select-action').val();
        const criteria = $('#select-criteria').val();
        const data = coreta.getData(period, action, criteria);
        console.log(data);
        const periods = coreta.getPeriodsAttributes();
        const actions = coreta.getActionsAttributes();
        const criterias = coreta.getCriteriasAttributes();
        $("#pagination").addClass("no-pagination");
        if (period == "all") {
            if (action == "all") {
                setDisplayHeader(actions, true);
                setDisplayBody(data, periods);
                setDisplayPagination($('#select-criteria'));
            } else if (criteria == "all") {
                setDisplayHeader(criterias, true);
                setDisplayBody(data, periods);
                setDisplayPagination($('#select-action'));
            } else {
                setDisplayHeader(periods, false);
                setDisplayBody(data);
            }
        } else if (action == "all") {
            if (criteria == "all") {
                setDisplayHeader(criterias, true);
                setDisplayBody(data, actions);
                setDisplayPagination($('#select-period'));
            } else {
                setDisplayHeader(actions, false);
                setDisplayBody(data);
            }
        } else if (criteria == "all") {
            setDisplayHeader(criterias, false);
            setDisplayBody(data);
        } else {
            $('#data-head').html('');
            $('#data-body').html(`<tr><td>${data}</td></tr>`);
        }
    }
    function setDisplayData(i, j, val) {
        const period = $('#select-period').val();
        const action = $('#select-action').val();
        const criteria = $('#select-criteria').val();
        if (period == "all") {
            if (action == "all") {
                coreta.setData(i, j - 1, criteria, val);
            } else if (criteria == "all") {
                coreta.setData(i, action, j - 1, val);
            } else {
                coreta.setData(j, action, criteria, val);
            }
        } else if (action == "all") {
            if (criteria == "all") {
                coreta.setData(period, i, j - 1, val);
            } else {
                coreta.setData(period, j, criteria, val);
            }
        } else if (criteria == "all") {
            coreta.setData(period, action, j, val);
        } else {
            coreta.setData(period, action, criteria, val);
        }
        $editingDataElem.text(val);
    }
    $('#select-action, #select-period, #select-criteria').change(function () {
        limitDisplaySelects($(this));
        displayData();
    });
    $('#data-table tbody').on("click", "td", function () {
        showEditDataModal($(this).parent().index(), $(this).index(), $(this));
    })
    $('#btn-step4-prev').click(function () {
        navigate(2, "right");
    });
    $("#next-view-page").click(function () {
        $displaySelect.children('option').eq($displaySelect.prop('selectedIndex')+1).prop('selected', true);
        displayData();
    });
    $("#prev-view-page").click(function () {
        $displaySelect.children('option').eq($displaySelect.prop('selectedIndex')-1).prop('selected', true);
        displayData();
    });
    $('#btn-step4-next').click(function () {
        navigate(5, "left");
    });
    
    // step 4
    let indiceType = 1;
    function hideSelectBy(){
        $("#div-select-by").hide();
    }
    function setSelectBy() {
        $("#div-select-by").show();
        const $select = $("#select-by").html('');
        coreta.getCriteriasAttributes().forEach((cri, i)=>{
            $select.append(`<option value="${i}">${cri.name}</option>`);
        });
    }
    function resetIndicesMenu() {
        $('.indice-menu button').prop("disabled",false);
    }
    function setIndicesTable(data) {
        const actions = coreta.getActionsAttributes();
        const $tr = $('<tr></tr>');
        $tr.append('<th></th>');
        actions.forEach(action => $tr.append(`<th>${action.name}</th>`));
        $('#indices-head').html($tr);
        $('#indices-body').html('');
        for (let i = 0; i < data.length; i++) {
            const $tr = $('<tr></tr>');
            $tr.append(`<th>${actions[i].name}</th>`);
            for (const d of data[i]) {
                $tr.append(`<th>${d}</th>`);
            }
            $('#indices-body').append($tr);
        }
    }
    function getConcordance() {
        const data = coreta.getConcordance($("#select-by").val());
        setIndicesTable(data);
        indiceType = 1;
        resetIndicesMenu();
        $("#concordance").prop("disabled",true);
    }
    function getDiscordance() {
        const data = coreta.getDiscordance($("#select-by").val());
        setIndicesTable(data);
        indiceType = 2;
        resetIndicesMenu();
        $("#discordance").prop("disabled",true);
    }
    function getCredibility() {
        const data = coreta.getCredibility($("#select-by").val());
        setIndicesTable(data);
        indiceType = 3;
        resetIndicesMenu();
        $("#credibility").prop("disabled",true);
    }
    function getSurclassement () {
        const data = coreta.getSurclassement($("#select-by").val());
        setIndicesTable(data);
        indiceType = 4;
        resetIndicesMenu();
        $("#surclassement").prop("disabled",true);
        
    }
    function getConcordanceGlobal() {
        const data = coreta.getConcordanceGlobal();
        setIndicesTable(data);
        indiceType = 5;
        resetIndicesMenu();
        $("#concordance-g").prop("disabled",true);
    }
    function getDiscordanceGlobal() {
        const data = coreta.getDiscordanceGlobal();
        setIndicesTable(data);
        indiceType = 6;
        resetIndicesMenu();
        $("#discordance-g").prop("disabled",true);
    }
    function getCredibilityGlobal() {
        const data = coreta.getCredibilityGlobal();
        setIndicesTable(data);
        indiceType = 7;
        resetIndicesMenu();
        $("#credibility-g").prop("disabled",true);
    }
    function getSurclassementGlobal() {
        const data = coreta.getSurclassementGlobal();
        setIndicesTable(data);
        indiceType = 8;
        resetIndicesMenu();
        $("#surclassement-g").prop("disabled",true);
    }
    $("#concordance").click(function () {
        setSelectBy();
        getConcordance();
    });
    $("#discordance").click(function () {
        setSelectBy();
        getDiscordance();
    });
    $("#credibility").click(function () {
        setSelectBy();
        getCredibility();
    });
    $("#surclassement").click(function () {
        setSelectBy();
        getSurclassement();
    });
    $("#concordance-g").click(function () {
        hideSelectBy();
        getConcordanceGlobal();
    });
    $("#discordance-g").click(function () {
        hideSelectBy();
        getDiscordanceGlobal();
    });
    $("#credibility-g").click(function () {
        hideSelectBy();
        getCredibilityGlobal();
    });
    $("#surclassement-g").click(function () {
        hideSelectBy();
        getSurclassementGlobal();
    });
    $("#select-by").change(function () {
        switch (indiceType) {
            case 1:
                getConcordance();
                break;
            case 2:
                getDiscordance();
                break;
            case 3:
                getCredibility();
                break;
            case 4:
                getSurclassement();
                break;
            
            default:
                break;
        }
    })
    $('#btn-step5-prev').click(function () {
        navigate(4, "right");
    });
})