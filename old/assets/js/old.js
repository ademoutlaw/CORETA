function changeView($select){
    if(viewMode=="3d"){
        
    }
    if($selectFilter !== $select){
        data = dataEntry.getData({
            period:$periodSelect.value,
            object:$objectSelect.value,
            criteria:$criteriaSelect.value
        });
        $selectFilter = $select;
        
        viewPageIndex = 1;
        totalPages = $selectFilter.options.length;
    }
    let mode = 4;
    if($periodSelect.value!=="all"){
        mode--;
        console.log("period");
    }
    if($objectSelect.value!=="all"){
        mode--;
        console.log("object");
    }
    if($criteriaSelect.value!=="all"){
        mode--;
        console.log("criteria");
    }
    viewMode = mode+"d";			
}
function viewData(){
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
function viewData3d() {
    console.log(viewBy, viewMode, viewPageIndex);
    
    //console.log($table);
    switch (viewBy) {
    	case "period":
    		totalPages = periodsNames.length;
    		$table.style.width = `${objectWidth+10}px`;
    		setTable(objectsNames, criteriasNames, function (i, j) {
    			return data[viewPageIndex][j][i];
    		});
    		break;
    	case "object":
    		totalPages = objectsNames.length;
    		$table.style.width = `${periodWidth+10}px`;
    		setTable(periodsNames, criteriasNames, function (i, j) {
    			return data[j][viewPageIndex][i];
    		});
    		break;
    	case "criteria":
    		$table.style.width = `${periodWidth+10}px`;
    		totalPages = criteriasNames.length;
    		setTable(periodsNames, objectsNames, function (i, j) {
    			return data[j][i][viewPageIndex];
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
    console.log(viewBy, viewMode, viewPageIndex);
}
function filterDataOld(){
    data = dataEntry.getData({
        period:$periodSelect.value,
        object:$objectSelect.value,
        criteria:$criteriaSelect.value
    });
    let mode = 3;
    viewPageIndex = 0;
    if($periodSelect.value!=="all"){
        mode--;
    }
    if($objectSelect.value!=="all"){
        mode--;
    }
    if($criteriaSelect.value!=="all"){
        mode--;
    }
    //
    console.log(data);
    viewData();
}
//filterDataOld();

	// <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function() {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					head.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					head.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function(msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if(sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer'))
			{
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
	// ]]>
