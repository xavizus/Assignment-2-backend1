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

/***/ "./src/javascript/main.js":
/*!********************************!*\
  !*** ./src/javascript/main.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Create apiURL\r\n// First get protocol, then get hostname, \r\n// then check if there is a port. if it exists, add colon and portnumber\r\n// lastly, path to api.\r\nlet URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;\r\n\r\n$().ready(async () => {\r\n    // check if token is valid.\r\n    let isTokenValid = await fetch(`${URL}/api/v1/verifyToken`).then(response => response.json());\r\n\r\n    // checks if user are authenticated.\r\n    let authenticated = false;\r\n    // check if user is admin\r\n    let isAdmin = false;\r\n\r\n    if (isTokenValid.response == 'OK') {\r\n        // Set authenticated to true\r\n        authenticated = true;\r\n        \r\n        toggleLoginLogoutButton();\r\n        if(isTokenValid.result.isAdmin == true) {\r\n            toggleAdminButton();\r\n            isAdmin = true;\r\n        }\r\n    }\r\n\r\n    // Get password requirements and jsonfy it\r\n    let passwordRequirements = await fetch(`${URL}/api/v1/passwordRequirements`).then(response => response.json());\r\n    // make the passwordComplexity string into a RexExp.\r\n    passwordRequirements.passwordComplexity = new RegExp(passwordRequirements.passwordComplexity, 'g');\r\n\r\n    // fixes an login modal, so when you press the login button, an login modal pops upp.\r\n    $('#loginModal').on('shown.bs.modal', function () {\r\n        $('#loginModal').trigger('focus');\r\n    });\r\n    // Clear all messages\r\n    $('#loginModal').on('hide.bs.modal', function () {\r\n        $('.messages').empty();\r\n    });\r\n\r\n    // opens a modal when you click on the Reviews Button\r\n    $('.restaurants-cards').on('click', async (event) => {\r\n        if (event.target.classList.contains('reviewButton')) {\r\n            // Clear all previous data\r\n            $('#reviews').empty();\r\n            $('#reviewTitle').empty();\r\n            $('#userRatings').removeClass('is-invalid is-valid');\r\n            $('#reviewText').removeClass('is-invalid is-valid');\r\n\r\n            // Get id from dataset\r\n            let id = event.target.dataset.id;\r\n            // Get data from API.\r\n            let data = await fetch(`${URL}/api/v1/getReviews/${id}`).then(response => response.json());\r\n\r\n            // If user is authenticated, show that the user can post a review.\r\n            if(authenticated){\r\n                $('#postReview').removeClass('d-none');\r\n            }\r\n            else{\r\n                $('#postReview').addClass('d-none');\r\n            }\r\n            // Add restaurant name\r\n            $('#reviewTitle').text(data.result.restaurantName);\r\n            // Add all reviews\r\n            for (let review of data.result.reviews) {\r\n                let html = $('<div class=\"row\"></div>');\r\n                html.append($('<p></p>').text(review.text));\r\n\r\n                $('#reviews').append(html);\r\n            }\r\n        }\r\n\r\n    });\r\n\r\n    // Get all forms that got the class needs-validation\r\n    let forms = $('.needs-validation');\r\n\r\n    $(forms).on('submit', async (event) => {\r\n        // prevent default (aka. reload page or go to form action path).\r\n        event.preventDefault();\r\n        // Checks validation from HTML5 properties of the input-fields\r\n        if (event.target.checkValidity()) {\r\n            if (event.target.id == \"login\") {\r\n                let data = await postLogin();\r\n                authenticated = data.loginSucessfull;\r\n                if(data.isAdmin == true) {\r\n                    isAdmin = true;\r\n                }\r\n            } else if (event.target.id == \"newAccount\") {\r\n                newAccount();\r\n            }\r\n        }\r\n    });\r\n\r\n    $('#navbarNav').on('click', (event) => {\r\n        if(event.target.classList.contains('logoutButton')) {\r\n            toggleLoginLogoutButton();\r\n            if(isAdmin) {\r\n                toggleAdminButton();\r\n            }\r\n            fetch(`${URL}/api/v1/logout`);\r\n            authenticated = false;\r\n            isAdmin = false;\r\n        }\r\n    });\r\n\r\n    // Get element of id \r\n    let checkNewAccountForm = $('#newAccount');\r\n\r\n    let timerForEmail;\r\n\r\n    let checks = {\r\n        emailChecked: false,\r\n        passwordChecked: false,\r\n        passwordRepeatChecked: false\r\n    };\r\n\r\n    // when keyup event is fired inside element\r\n    $(checkNewAccountForm).on('keyup', async (event) => {\r\n\r\n        if (event.target.id == \"newEmail\") {\r\n\r\n            // Simple email check. \r\n            let emailPattern = /\\S*[^@]@[a-z0-9\\.]+/i;\r\n\r\n            // if the regexp matches\r\n            if (event.target.value.match(emailPattern)) {\r\n                // cleartimeout\r\n                clearTimeout(timerForEmail);\r\n                // set timeout\r\n                timerForEmail = setTimeout(async function () {\r\n                    // get value from input field\r\n                    let value = event.target.value;\r\n\r\n                    // make api call to check if mail exists\r\n                    let response = await fetch(`${URL}/api/v1/emailExist/${value}`).then(response => response.json());\r\n\r\n                    // if it exisist\r\n                    if (response.result.exist) {\r\n                        // inform the user that the email is already used.\r\n                        changeValidation(event.target, false);\r\n                        checks.emailChecked = false;\r\n                    } else {\r\n                        // Inform the user that the email is not used.\r\n                        changeValidation(event.target, true);\r\n                        checks.emailChecked = true;\r\n                    }\r\n                }, 500);\r\n            }\r\n            // regex does not maches\r\n            else {\r\n                // inform the user that it's invalid mail\r\n                changeValidation(event.target, false);\r\n            }\r\n        } else if (event.target.id == \"newPassword\") {\r\n\r\n            // check if password meets the requirements. see .env for requirements.\r\n            if ($('#newPassword')[0].value.length >= passwordRequirements.passwordMinimumLength &&\r\n                $('#newPassword')[0].value.match(passwordRequirements.passwordComplexity)\r\n            ) {\r\n                // If both requirements are fufilled inform the user \r\n                changeValidation($('#newPassword'), true);\r\n                checks.passwordChecked = true;\r\n            } else {\r\n                // If any of the requirements fails, inform the user.\r\n                changeValidation($('#newPassword'), false);\r\n                checks.passwordChecked = false;\r\n            }\r\n        }\r\n        // if event target is ether newPassword or newPasswordRepeat\r\n        // and if length of both passwords exceed 0\r\n        if (\r\n            (event.target.id == \"newPassword\" ||\r\n                event.target.id == \"newPasswordRepeat\"\r\n            ) &&\r\n            (\r\n                $('#newPassword')[0].value.length > 0 &&\r\n                $('#newPasswordRepeat')[0].value.length > 0\r\n            )\r\n        ) {\r\n            // Check if both passwords are equal\r\n            if ($('#newPassword')[0].value == $('#newPasswordRepeat')[0].value) {\r\n                changeValidation($('#newPasswordRepeat'), true);\r\n                checks.passwordRepeatChecked = true;\r\n            } else {\r\n                changeValidation($('#newPasswordRepeat'), false);\r\n                checks.passwordRepeatChecked = false;\r\n            }\r\n        }\r\n\r\n        // Checks if everything are OK.\r\n        if (checks.emailChecked == true &&\r\n            checks.passwordChecked == true &&\r\n            checks.passwordRepeatChecked == true\r\n        ) {\r\n            // if everything are ok. Enable submit button.\r\n            $(`#newAccount button:submit`)[0].disabled = false;\r\n        } else {\r\n            // if anything isn't ok. Disable submit button\r\n            $(`#newAccount button:submit`)[0].disabled = true;\r\n        }\r\n\r\n    });\r\n\r\n\r\n    $('#postReview').on('submit', (event) => {\r\n        let rating = $(\"#postReview\").find('.checked').length;\r\n        let reviewText = $(\"#reviewText\").val();\r\n        if(rating == 0) {\r\n            changeValidation('#userRatings', false);\r\n        }\r\n        if(reviewText == \"\") {\r\n            changeValidation('#reviewText', false);\r\n        }\r\n    });\r\n});\r\n/**\r\n * Changes class 'is-valid' and 'is-invalid' \r\n * @param {string or $(jqueryObject)} target \r\n * @param {boolean} isValid \r\n */\r\nfunction changeValidation(target, isValid) {\r\n    if (isValid) {\r\n        $(target).addClass('is-valid');\r\n        $(target).removeClass('is-invalid')\r\n    } else {\r\n        $(target).addClass('is-invalid');\r\n        $(target).removeClass(\"is-valid\");\r\n    }\r\n}\r\n/**\r\n *  Posts new account to api.\r\n */\r\nasync function newAccount() {\r\n    let email = $('#newEmail').val();\r\n    let password = $('#newPassword').val();\r\n\r\n    let data = {\r\n        email: email,\r\n        password: password\r\n    };\r\n    let responseData = await postData(`${URL}/account/newAccount`, data);\r\n\r\n    if (responseData.response != 'OK') {\r\n        let message = $('<div class=\"alert alert-danger m-1\" role=\"alert\"></div>').text(\"Error when creating account\");\r\n        $('.messages').append(message);\r\n    } else {\r\n        let message = $('<div class=\"alert alert-success m-1\" role=\"alert\"></div>').text(\"Your account has been sucessfully created!\");\r\n        $('.messages').append(message);\r\n    }\r\n}\r\n\r\n/**\r\n * Posts login to api.\r\n */\r\nasync function postLogin() {\r\n    let inputFields = $('.needs-validation * :input').not(':input[type=button], :input[type=submit]');\r\n    let dataObject = {};\r\n    let returnObject = {\r\n        loginSucessfull: false,\r\n    }\r\n    for (let element of inputFields) {\r\n        dataObject[element.name] = element.value;\r\n    }\r\n    let data = await postData(`${URL}/account/login`, dataObject);\r\n    if (data.response != 'OK') {\r\n        let message = $('<div class=\"alert alert-danger m-1\" role=\"alert\"></div>').text(\"Error when creating account\");\r\n        $('.messages').append(message);\r\n        return returnObject;\r\n    }\r\n    let message = $('<div class=\"alert alert-success m-1\" role=\"alert\"></div>').text(\"You sucessfully logged in!\");\r\n    $('.messages').append(message);\r\n\r\n    // Hide login modal\r\n    $('#loginModal').modal('hide');\r\n\r\n    toggleLoginLogoutButton();\r\n    returnObject.loginSucessfull = true;\r\n\r\n    if(data.result.isAdmin == true) {\r\n        toggleAdminButton();\r\n        returnObject.isAdmin = true;\r\n    }\r\n    return returnObject;\r\n}\r\n\r\n/**\r\n * Posts data to url.\r\n * @param {string} url \r\n * @param {object} data \r\n */\r\nasync function postData(url, data) {\r\n    let responseData = await fetch(url, {\r\n        method: 'POST',\r\n        headers: {\r\n            'Content-Type': 'application/json'\r\n        },\r\n        body: JSON.stringify(data)\r\n    }).then(response => response.json());\r\n    return responseData;\r\n}\r\n\r\nfunction toggleAdminButton() {\r\n    let adminButton = $('.adminLink');\r\n    if(adminButton.hasClass('d-none')) {\r\n        adminButton.removeClass('d-none');\r\n    }\r\n    else {\r\n        adminButton.addClass('d-none');\r\n\r\n    }\r\n}\r\n\r\nfunction toggleLoginLogoutButton() {\r\n    let loginButton = $('.loginButton');\r\n    let logoutButton = $('.logoutButton');\r\n    if (loginButton.length) {\r\n        loginButton.parent().append(`<button class=\"btn btn-primary logoutButton\">Logout</button>`);\r\n        loginButton.remove();\r\n    } else if (logoutButton.length) {\r\n        logoutButton.parent().append(`<button class=\"btn btn-primary loginButton\" data-toggle=\"modal\" data-target=\"#loginModal\">Login</button>`);\r\n        logoutButton.remove();\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/javascript/main.js?");

/***/ }),

/***/ "./src/javascript/rateings.js":
/*!************************************!*\
  !*** ./src/javascript/rateings.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$().ready(() => {\r\n\r\n    let settings = {\r\n        currentValue: 0\r\n    };\r\n\r\n    let wonderfullFunctions = {\r\n        fill: (element) => {\r\n            let index = $(\".fa-star\").index(element) + 1;\r\n            $(\".fa-star\").slice(0, index).addClass('hover');\r\n        },\r\n        clear: () => {\r\n            $(\".fa-star\").filter('.hover').removeClass('hover');\r\n            $(\".fa-star\").filter('.checked').removeClass('checked');\r\n        },\r\n        reset: () => {\r\n            $('.fa-star').slice(0, settings.currentValue).addClass('checked');\r\n        }\r\n    };\r\n\r\n    $('#reviewModal').on('hide.bs.modal', function () {\r\n        wonderfullFunctions.clear();\r\n        settings.currentValue = 0;\r\n    });\r\n\r\n    $(\".fa-star\").mouseenter((event) => {\r\n        event.preventDefault();\r\n        wonderfullFunctions.clear();\r\n        wonderfullFunctions.fill(event.target);\r\n    });\r\n\r\n    $(\".fa-star\").mouseleave((event) => {\r\n        event.preventDefault();\r\n        wonderfullFunctions.clear();\r\n        wonderfullFunctions.reset();\r\n    });\r\n\r\n    $('.fa-star').click((event) => {\r\n        event.preventDefault();\r\n        let index = $(\".fa-star\").index(event.target) + 1;\r\n        settings.currentValue = index;\r\n        wonderfullFunctions.reset();\r\n    });\r\n});\n\n//# sourceURL=webpack:///./src/javascript/rateings.js?");

/***/ }),

/***/ 0:
/*!*******************************************************************!*\
  !*** multi ./src/javascript/rateings.js ./src/javascript/main.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/javascript/rateings.js */\"./src/javascript/rateings.js\");\nmodule.exports = __webpack_require__(/*! ./src/javascript/main.js */\"./src/javascript/main.js\");\n\n\n//# sourceURL=webpack:///multi_./src/javascript/rateings.js_./src/javascript/main.js?");

/***/ })

/******/ });