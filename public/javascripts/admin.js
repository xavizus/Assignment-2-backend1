/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/javascript/admin.js":
/*!*********************************!*\
  !*** ./src/javascript/admin.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Create apiURL\r\n// First get protocol, then get hostname, \r\n// then check if there is a port. if it exists, add colon and portnumber\r\n// lastly, path to api.\r\nlet URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;\r\n\r\n$().ready(() => {\r\n    //Ugly solution to add \"add Restaurant button\" to admin-view in navbar.\r\n    let listItem = $(' <li class=\"nav-item\"> </li>');\r\n    let button = $('<button class=\"btn btn-primary mr-1 addRestaurant\" data-toggle=\"modal\" data-target=\"#addRestaurantsModal\"></button')\r\n    .text('Add restaurant');\r\n    listItem.append(button);\r\n    listItem.insertAfter('.adminLink');\r\n\r\n    $('.restaurants-cards').on('click', async (event) => {\r\n        if (event.target.classList.contains('editRestaurant')) {\r\n            // Clear all previous data\r\n            let inputs = ['restaurantName', 'country', 'city', 'address', 'geners', 'generToAdd'];\r\n            for (let input of inputs) {\r\n                $(`#${input}`).empty();\r\n                $(`#${input}`).removeClass('is-invalid is-valid');\r\n            }\r\n\r\n            // get restaurantId from event\r\n            let restaurantId = event.target.dataset.id;\r\n\r\n            // fetch data about the restaurant\r\n            let data = await fetch(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());\r\n\r\n            if (data.result.found == false) {\r\n                console.error(\"RestaurantId not found!\");\r\n                return;\r\n            }\r\n\r\n            // Go through all our inputs, and fill them with the current data.\r\n            for (let input of inputs) {\r\n                $(`#${input}`).val(data.result[input]);\r\n            }\r\n\r\n            // get geners by restaurantid\r\n            let responseData = await fetch(`${URL}/api/v1/genersById/${restaurantId}`).then(response => response.json());\r\n\r\n            // store geners array\r\n            let geners = responseData.result.geners;\r\n            if (responseData.result.found != false) {\r\n\r\n            // loop through geners and create list element\r\n            for (let gener of geners) {\r\n                let newElement = $(`<li class=\"list-group-item\" data-id=\"${gener.gener_id}\"></li>`)\r\n                    .text(gener.genreName)\r\n                    .append(`<i class=\"material-icons float-right mr-1 pointer deleteGener\" data-id=\"${gener.gener_id}\">delete</i>`);\r\n\r\n                $('#geners').append(newElement);\r\n            }\r\n            }\r\n\r\n            // get all Geners that exists\r\n            responseData = await fetch(`${URL}/api/v1/allGeners`).then(response => response.json());\r\n\r\n            if (responseData.result.found == false) {\r\n                console.log(\"No data found\");\r\n                return;\r\n            }\r\n\r\n            // store all geners array\r\n            let allGeners = responseData.result.geners;\r\n            \r\n            // sort allGeners\r\n            allGeners.sort((a, b) => (a.genreName.toUpperCase() > b.genreName.toUpperCase()) ? 1 : -1);\r\n            \r\n            // Create select element\r\n            let selectList = $('<select id=\"selectGenerToAdd\" class=\"form-control\"></select>');\r\n\r\n            // Loop through all geners and show the geners that's not maches the current\r\n            // geners that the restaurant already got.\r\n            for (let gener of allGeners) {\r\n                if (geners == undefined || (geners.findIndex((currentValue) => currentValue.gener_id == gener.id) == -1)) {\r\n                    let option = $('<option/>')\r\n                        .text(gener.genreName)\r\n                        .attr('data-id', gener.id);\r\n                    selectList.append(option);\r\n                }\r\n            }\r\n            $('#generToAdd').append(selectList);\r\n\r\n            // Last resort. Add restaurantId to the form\r\n            $('#editRestaurantForm').attr('data-restaurantId', `${restaurantId}`);\r\n\r\n\r\n        } else if (event.target.classList.contains('removeRestaurant')) {\r\n            let restaurantId = event.target.dataset.id;\r\n            let data = await fetch(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());\r\n            \r\n            $('#deleteRestaurantName').text(data.result.restaurantName);\r\n\r\n            $('#deleteRestaurant').attr('data-id', restaurantId);\r\n        }\r\n    });\r\n\r\n    // Handles click events inside delete restaurant modal\r\n\r\n    $('#deleteRestaurantsModal').on('click', async(event) => {\r\n        if(event.target.id == \"deleteRestaurant\") {\r\n            let restaurantId = event.target.dataset.id;\r\n\r\n            let responseData = await sendData(`${URL}/api/v1/deleteRestaurant/${restaurantId}`, 'DELETE');\r\n\r\n            $('#deleteRestaurantsModal').modal('hide');\r\n\r\n            let messageElement = $('<div class=\"alert\" role=\"alert\"></div>');\r\n\r\n            if(responseData.response == 'ERROR') {\r\n                messageElement.addClass('alert-danger')\r\n                .text(responseData.error);\r\n            }\r\n            else {\r\n                messageElement.addClass('alert-success')\r\n                .text(responseData.result);\r\n                $(`.cardSlot[data-id='${restaurantId}'`).remove();\r\n            }\r\n\r\n            $('#systemMessages').append(messageElement);\r\n\r\n        }\r\n        \r\n    });\r\n\r\n\r\n    // handles click event inside edit restaurant modal.\r\n    $('#editRestaurantModal').on('click', async (event) => {\r\n\r\n        // adds selected gener to geners.\r\n        if (event.target.id == 'addGener') {\r\n            let id = $('#generToAdd option:selected').data('id');\r\n            let text = $('#generToAdd option:selected').text();\r\n            $('#generToAdd option:selected').remove();\r\n\r\n            let newElement = $(`<li class=\"list-group-item\" data-id=\"${id}\"></li>`)\r\n                .text(text)\r\n                .append(`<i class=\"material-icons float-right mr-1 pointer deleteGener\" data-id=\"${id}\">delete</i>`);\r\n\r\n            $('#geners').append(newElement);\r\n        }\r\n\r\n        // removes a gener from geners list and add it to add gener select list\r\n        else if (event.target.classList.contains('deleteGener')) {\r\n            let id = $(event.target).data('id');\r\n            let text = $(event.target).parent().text();\r\n            $(event.target).parent().remove();\r\n            text = text.substring(0,text.indexOf('delete'));\r\n            let option = $('<option/>')\r\n                        .text(text)\r\n                        .attr('data-id', id);\r\n            $('#selectGenerToAdd').append(option);\r\n        }\r\n\r\n        // Post data on submit.\r\n        else if (event.target.type == 'submit') {\r\n            let dataObject = {};\r\n\r\n            let objectsToGetDataFrom = ['restaurantName', 'country', 'city', 'address', 'geners'];\r\n\r\n            for (let object of objectsToGetDataFrom) {\r\n                if (object == 'geners') {\r\n                    dataObject.geners = [];\r\n                    let genersToAdd = $(`#${object} li`);\r\n                    for (let gener of genersToAdd) {\r\n                        dataObject.geners.push($(gener).data('id'));\r\n                    }\r\n                } else {\r\n                    dataObject[object] = $(`#${object}`).val();\r\n                }\r\n            }\r\n            let restaurant_id = $('#editRestaurantForm').attr('data-restaurantId');\r\n\r\n            let responseData = await sendData (`${URL}/api/v1/updateRestaurant/${restaurant_id}`, 'PUT', dataObject);\r\n            let messages = $('.updateMessages');\r\n            if(responseData.response == \"ERROR\") {\r\n                let errorMessage = $('<div class=\"alert alert-danger\" role=\"alert\"></div>')\r\n                .text(responseData.error);\r\n\r\n                messages.append(errorMessage);\r\n                return;\r\n            }\r\n\r\n            let sucessfullMessage = $('<div class=\"alert alert-success\" role=\"alert\"></div>')\r\n            .text(responseData.result);\r\n            messages.append(sucessfullMessage);\r\n        }\r\n    });\r\n\r\n\r\n    $('#addRestaurantsModal').on('show.bs.modal', async (event) => {\r\n\r\n        let inputs = ['restaurantName2', 'addCountry2', 'addCity2', 'addAddress2', 'geners2', 'generToAdd2'];\r\n            for (let input of inputs) {\r\n                $(`#${input}`).empty();\r\n                $(`#${input}`).val('');\r\n                $(`#${input}`).removeClass('is-invalid is-valid');\r\n            }\r\n\r\n        let responseData = await fetch(`${URL}/api/v1/allGeners`).then(response => response.json());\r\n        \r\n        let allGeners = responseData.result.geners;\r\n        // sort allGeners\r\n        allGeners.sort((a, b) => (a.genreName.toUpperCase() > b.genreName.toUpperCase()) ? 1 : -1);\r\n            \r\n        // Create select element\r\n        let selectList = $('<select id=\"selectGenerToAdd2\" class=\"form-control\"></select>');\r\n\r\n        // Loop through all geners and show the geners that's not maches the current\r\n        // geners that the restaurant already got.\r\n        for (let gener of allGeners) {\r\n                let option = $('<option/>')\r\n                    .text(gener.genreName)\r\n                    .attr('data-id', gener.id);\r\n                selectList.append(option);\r\n        }\r\n        $('#generToAdd2').append(selectList);\r\n\r\n    });\r\n\r\n    // Handles click events on add restaurants modal\r\n    $('#addRestaurantsModal').on('click', async (event) => {\r\n\r\n        // adds selected gener to geners.\r\n        if (event.target.id == 'addGener2') {\r\n            let id = $('#generToAdd2 option:selected').data('id');\r\n            let text = $('#generToAdd2 option:selected').text();\r\n            $('#generToAdd2 option:selected').remove();\r\n\r\n            let newElement = $(`<li class=\"list-group-item\" data-id=\"${id}\"></li>`)\r\n                .text(text)\r\n                .append(`<i class=\"material-icons float-right mr-1 pointer deleteGener\" data-id=\"${id}\">delete</i>`);\r\n\r\n            $('#geners2').append(newElement);\r\n        }\r\n\r\n        // removes a gener from geners list and add it to add gener select list\r\n        else if (event.target.classList.contains('deleteGener')) {\r\n            let id = $(event.target).data('id');\r\n            let text = $(event.target).parent().text();\r\n            $(event.target).parent().remove();\r\n            text = text.substring(0,text.indexOf('delete'));\r\n            let option = $('<option/>')\r\n                        .text(text)\r\n                        .attr('data-id', id);\r\n            $('#selectGenerToAdd2').append(option);\r\n        }\r\n\r\n        // Post data on submit.\r\n        else if (event.target.type == 'submit') {\r\n            let dataObject = {};\r\n\r\n            let objectsToGetDataFrom = ['addRestaurantName2', 'addCountry2', 'addCity2', 'addAddress2', 'geners2'];\r\n\r\n            for (let object of objectsToGetDataFrom) {\r\n                if (object == 'geners2') {\r\n                    dataObject.geners = [];\r\n                    let genersToAdd = $(`#${object} li`);\r\n                    for (let gener of genersToAdd) {\r\n                        dataObject.geners.push($(gener).data('id'));\r\n                    }\r\n                } else {\r\n                    dataObject[object] = $(`#${object}`).val();\r\n                }\r\n            }\r\n            let restaurant_id = $('#editRestaurantForm').attr('data-restaurantId');\r\n\r\n            let responseData = await sendData (`${URL}/api/v1/addRestaurant`, 'POST', dataObject);\r\n            let messages = $('.updateMessages');\r\n            if(responseData.response == \"ERROR\") {\r\n                let errorMessage = $('<div class=\"alert alert-danger\" role=\"alert\"></div>')\r\n                .text(responseData.error);\r\n\r\n                messages.append(errorMessage);\r\n                return;\r\n            }\r\n\r\n            let sucessfullMessage = $('<div class=\"alert alert-success\" role=\"alert\"></div>')\r\n            .text(responseData.result);\r\n            messages.append(sucessfullMessage);\r\n        }\r\n    });\r\n\r\n});\r\n\r\n\r\n/**\r\n * POST/PUT/DELETE data to url.\r\n * @param {string} url \r\n * @param {object} data \r\n */\r\nasync function sendData(url,method, data = {}) {\r\n    let responseData = await fetch(url, {\r\n        method: method.toUpperCase(),\r\n        headers: {\r\n            'Content-Type': 'application/json'\r\n        },\r\n        body: JSON.stringify(data)\r\n    }).then(response => response.json());\r\n    return responseData;\r\n}\n\n//# sourceURL=webpack:///./src/javascript/admin.js?");

/***/ }),

/***/ 1:
/*!***************************************!*\
  !*** multi ./src/javascript/admin.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/javascript/admin.js */\"./src/javascript/admin.js\");\n\n\n//# sourceURL=webpack:///multi_./src/javascript/admin.js?");

/***/ })

/******/ });