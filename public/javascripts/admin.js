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

/***/ "./node_modules/node-fetch/browser.js":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// ref: https://github.com/tc39/proposal-global\nvar getGlobal = function () {\n\t// the only reliable means to get the global object is\n\t// `Function('return this')()`\n\t// However, this causes CSP violations in Chrome apps.\n\tif (typeof self !== 'undefined') { return self; }\n\tif (typeof window !== 'undefined') { return window; }\n\tif (typeof global !== 'undefined') { return global; }\n\tthrow new Error('unable to locate global object');\n}\n\nvar global = getGlobal();\n\nmodule.exports = exports = global.fetch;\n\n// Needed for TypeScript and Webpack.\nexports.default = global.fetch.bind(global);\n\nexports.Headers = global.Headers;\nexports.Request = global.Request;\nexports.Response = global.Response;\n\n//# sourceURL=webpack:///./node_modules/node-fetch/browser.js?");

/***/ }),

/***/ "./src/javascript/admin.js":
/*!*********************************!*\
  !*** ./src/javascript/admin.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-fetch */ \"./node_modules/node-fetch/browser.js\");\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_0__);\n\r\n\r\n// Create apiURL\r\n// First get protocol, then get hostname, \r\n// then check if there is a port. if it exists, add colon and portnumber\r\n// lastly, path to api.\r\nlet URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;\r\n\r\n$().ready(() => {\r\n\r\n    $('.restaurants-cards').on('click', async (event) => {\r\n        if (event.target.classList.contains('editRestaurant')) {\r\n            // Clear all previous data\r\n            let inputs = ['restaurantName', 'country', 'city', 'address', 'geners'];\r\n            for (let input of inputs) {\r\n                $(`#${input}`).empty();\r\n                $(`#${input}`).removeClass('is-invalid is-valid');\r\n            }\r\n\r\n            let restaurantId = event.target.dataset.id;\r\n            let data = await node_fetch__WEBPACK_IMPORTED_MODULE_0___default()(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());\r\n\r\n            if (data.result.found == false) {\r\n                console.error(\"RestaurantId not found!\");\r\n            }\r\n\r\n            for (let input of inputs) {\r\n                $(`#${input}`).val(data.result[input]);\r\n            }\r\n\r\n            let responseData = await node_fetch__WEBPACK_IMPORTED_MODULE_0___default()(`${URL}/api/v1/genersById/${restaurantId}`).then(response => response.json());\r\n\r\n            if (responseData.result.found == false) {\r\n                console.log(\"No data\");\r\n                return;\r\n            }\r\n\r\n            let geners = responseData.result.geners;\r\n\r\n            for (let gener of geners) {\r\n                let newElement = $(`<li class=\"list-group-item\" data-id=\"${gener.id}\"></li>`)\r\n                    .text(gener.genreName);\r\n\r\n                $('#geners').append(newElement);\r\n            }\r\n\r\n            responseData = await node_fetch__WEBPACK_IMPORTED_MODULE_0___default()(`${URL}/api/v1/allGeners`).then(response => response.json());\r\n\r\n            if (responseData.result.found == false) {\r\n                console.log(\"No data\");\r\n                return;\r\n            }\r\n\r\n            let allGeners = responseData.result.geners;\r\n            allGeners.sort((a, b) => (a.genreName.toUpperCase() > b.genreName.toUpperCase()) ? 1 : -1);\r\n            let selectList = $('<select id=\"geners\" class=\"form-control\"></select>');\r\n            for (let gener of allGeners) {\r\n                if (geners.findIndex((currentValue) => currentValue.id == gener.id) == -1) {\r\n                    let option = $('<option/>')\r\n                        .text(gener.genreName)\r\n                        .attr('data-id', gener.id);\r\n                    selectList.append(option);\r\n                }\r\n            }\r\n            $('#generToAdd').append(selectList);\r\n        } else if (event.target.classList.contains('removeRestaurant')) {\r\n\r\n        }\r\n    });\r\n\r\n\r\n    $('#editRestaurantModal').on('click', (event) => {\r\n        if (event.target.id == 'addGener') {\r\n            let dataId = $('#generToAdd option:selected').data('id');\r\n            let text = $('#generToAdd option:selected').text();\r\n            $('#generToAdd option:selected').remove();\r\n\r\n            let newElement = $(`<li class=\"list-group-item\" data-id=\"${dataId}\"></li>`)\r\n                .text(text);\r\n\r\n            $('#geners').append(newElement);\r\n        } else if (event.target.type == 'submit') {\r\n            let dataObject = {};\r\n\r\n            let objectsToGetDataFrom = ['restaurantName', 'country', 'city', 'address', 'geners'];\r\n\r\n            for (let object of objectsToGetDataFrom) {\r\n                if (object == 'geners') {\r\n                    dataObject.geners = [];\r\n                    let genersToAdd = $(`#${object} li`);\r\n                    for (let gener of genersToAdd) {\r\n                        dataObject.geners.push($(gener).data('id'));\r\n                    }\r\n                } else {\r\n                    dataObject[object] = $(`#${object}`).val();\r\n                }\r\n            }\r\n\r\n            console.log(dataObject);\r\n        }\r\n    });\r\n\r\n});\n\n//# sourceURL=webpack:///./src/javascript/admin.js?");

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