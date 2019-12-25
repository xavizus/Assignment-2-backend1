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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/javascript/createAccount.js":
/*!*****************************************!*\
  !*** ./src/javascript/createAccount.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$().ready(() => {\r\n    \r\n});\n\n//# sourceURL=webpack:///./src/javascript/createAccount.js?");

/***/ }),

/***/ "./src/javascript/login.js":
/*!*********************************!*\
  !*** ./src/javascript/login.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$().ready(() => {\r\n    let forms = $('.needs-validation');\r\n    console.log(forms);\r\n    $(forms).on('change',(event) => {\r\n        event.preventDefault();\r\n        event.stopPropagation();\r\n        if(event.target.checkValidity()) {\r\n           \r\n        }\r\n\r\n        $(event.target).addClass('was-validated');\r\n    });\r\n});\n\n//# sourceURL=webpack:///./src/javascript/login.js?");

/***/ }),

/***/ "./src/javascript/rateings.js":
/*!************************************!*\
  !*** ./src/javascript/rateings.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$().ready(() => {\r\n\r\n    let settings = {\r\n        currentValue: 0\r\n    };\r\n\r\n    let wonderfullFunctions = {\r\n        fill: (element) => {\r\n            let index = $(\".fa-star\").index(element) + 1;\r\n            $(\".fa-star\").slice(0,index).addClass('hover');\r\n        },\r\n        clear: () => {\r\n            $(\".fa-star\").filter('.hover').removeClass('hover');\r\n            $(\".fa-star\").filter('.checked').removeClass('checked');\r\n        },\r\n        reset: () => {\r\n           $('.fa-star').slice(0,settings.currentValue).addClass('checked');\r\n        }\r\n    };\r\n\r\n    $(\".fa-star\").mouseenter((event)=> {\r\n        event.preventDefault();\r\n        wonderfullFunctions.clear();\r\n        wonderfullFunctions.fill(event.target);\r\n    });\r\n\r\n    $(\".fa-star\").mouseleave((event)=> {\r\n        event.preventDefault();\r\n        wonderfullFunctions.clear();\r\n        wonderfullFunctions.reset();\r\n    });\r\n\r\n    $('.fa-star').click((event) => {\r\n        event.preventDefault();\r\n        let index = $(\".fa-star\").index(event.target) + 1;\r\n        settings.currentValue = index;\r\n        wonderfullFunctions.reset();\r\n    });\r\n});\n\n//# sourceURL=webpack:///./src/javascript/rateings.js?");

/***/ }),

/***/ 0:
/*!******************************************************************************************************!*\
  !*** multi ./src/javascript/rateings.js ./src/javascript/login.js ./src/javascript/createAccount.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/javascript/rateings.js */\"./src/javascript/rateings.js\");\n__webpack_require__(/*! ./src/javascript/login.js */\"./src/javascript/login.js\");\nmodule.exports = __webpack_require__(/*! ./src/javascript/createAccount.js */\"./src/javascript/createAccount.js\");\n\n\n//# sourceURL=webpack:///multi_./src/javascript/rateings.js_./src/javascript/login.js_./src/javascript/createAccount.js?");

/***/ })

/******/ });