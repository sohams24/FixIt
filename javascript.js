var req;
var isIE;
var searchId;
var completeTable;
var autoRow;

function init() {
    searchId = document.getElementById("searchId");
    console.log(searchId);
    completeTable = document.getElementById("complete-table");
    autoRow = document.getElementById("auto-row");
}

function doCompletion() {
    console.log("Do completion is called!");
    console.log(searchId);
    var url = "autocomplete?action=complete&searchId=" + escape(searchId.value);
    req = initRequest();
    req.open("GET", url, true);
    req.onreadystatechange = callback;
    req.send(null);
}

function initRequest() {
    if (window.XMLHttpRequest) {
        if (navigator.userAgent.indexOf('MSIE') != -1) {
            isIE = true;
        }
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function callback() {
    clearTable();

    if (req.readyState == 4) {
        if (req.status == 200) {
            parseMessages(req.responseXML);
        }
    }
}

function appendService(serviceName,serviceId) {

    var row;
    var cell;
    var linkElement;
    
    if (isIE) {
        completeTable.style.display = 'block';
        row = completeTable.insertRow(completeTable.rows.length);
        cell = row.insertCell(0);
    } else {
        completeTable.style.display = 'table';
        row = document.createElement("tr");
        cell = document.createElement("td");
        row.appendChild(cell);
        completeTable.appendChild(row);
    }

    cell.className = "popupCell";

    linkElement = document.createElement("a");
    linkElement.className = "popupItem";
    linkElement.setAttribute("href", "autocomplete?action=lookup&searchId=" + serviceId);
    linkElement.appendChild(document.createTextNode(serviceName));
    cell.appendChild(linkElement);
}

function clearTable() {
    if (completeTable.getElementsByTagName("tr").length > 0) {
        completeTable.style.display = 'none';
        for (loop = completeTable.childNodes.length -1; loop >= 0 ; loop--) {
            completeTable.removeChild(completeTable.childNodes[loop]);
        }
    }
}


function parseMessages(responseXML) {
    
    // no matches returned
    if (responseXML == null) {
        return false;
    } else {

        var services = responseXML.getElementsByTagName("services")[0];

        if (services.childNodes.length > 0) {
            completeTable.setAttribute("bordercolor", "black");
            completeTable.setAttribute("border", "1");
    
            for (loop = 0; loop < services.childNodes.length; loop++) {
                var service = services.childNodes[loop];
                var serviceName = service.getElementsByTagName("serviceName")[0];
                var serviceId = service.getElementsByTagName("id")[0];
                appendService(serviceName.childNodes[0].nodeValue,
                    serviceId.childNodes[0].nodeValue);
            }
        }
    }
}

// function parseMessages(responseXML) {
    
//     // no matches returned
//     if (responseXML == null) {
//         return false;
//     } else {

//         var products = responseXML.getElementsByTagName("services")[0];

//         if (products.childNodes.length > 0) {
//             completeTable.setAttribute("bordercolor", "black");
//             completeTable.setAttribute("border", "1");
    
//             for (loop = 0; loop < products.childNodes.length; loop++) {
//                 var product = products.childNodes[loop];
//                 var productName = product.getElementsByTagName("productName")[0];
//                 var productId = product.getElementsByTagName("id")[0];
//                 appendService(productName.childNodes[0].nodeValue,
//                     productId.childNodes[0].nodeValue);
//             }
//         }
//     }
// }