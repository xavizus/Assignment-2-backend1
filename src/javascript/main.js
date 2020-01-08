import fetch from "node-fetch";

// Create apiURL
// First get protocol, then get hostname, 
// then check if there is a port. if it exists, add colon and portnumber
// lastly, path to api.
let URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;

$().ready(async () => {
    // check if token is valid.
    let isTokenValid = await fetch(`${URL}/api/v1/verifyToken`).then(response => response.json());

    // checks if user are authenticated.
    let authenticated = false;
    // check if user is admin
    let isAdmin = false;

    if (isTokenValid.response == 'OK') {
        // Set authenticated to true
        authenticated = true;

        toggleLoginLogoutButton();
        if (isTokenValid.result.isAdmin != undefined && isTokenValid.result.isAdmin == true) {
            toggleAdminButton();
            isAdmin = true;
        }
    }

    // Get password requirements and jsonfy it
    let passwordRequirements = await fetch(`${URL}/api/v1/passwordRequirements`).then(response => response.json());
    // make the passwordComplexity string into a RexExp.
    passwordRequirements.passwordComplexity = new RegExp(passwordRequirements.passwordComplexity, 'g');

    // When you click on geners dropdown.
    $('#dropdownGener').on('click', async (event) => {

        // Checks if div is empty.
        if ($.trim($('#dropdownMenuGener').html()) == '') {

            let data = await fetch(`${URL}/api/v1/allGeners`).then(response => response.json());
            for (let gener of data.result.geners) {
                let newElement = $('<a class="dropdown-item pointer"></a>')
                    .attr('data-id', gener.id)
                    .text(gener.genreName);

                $('#dropdownMenuGener').append(newElement);
            }
        }

    });

    // When you click on any geners in dropdown.
    $('#dropdownMenuGener').on('click', async (event) => {

        // Check that the dataset is set.
        if (!isNaN(event.target.dataset.id)) {
            let data = await fetch(`${URL}/api/v1/restaurantsByGener/${event.target.dataset.id}`).then(response => response.json());

            // Clear previous data
            $('.restaurants-cards').empty();

            // if the total we got is 0.
            if (data.result.length == 0) {
                $('.restaurants-cards').append(`<h1></h1>`).text(`No restaurants found!`);
            }

            for (let restaurant of data.result) {

                let cardSlot = $('<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 cardSlot">').attr('data-id',
                    restaurant.id);
                let img = $(`<img src="" class="card-img-top" alt="...">`).attr('src', restaurant.avatar);
                let cardBody = $(`<div class="card-body"></div>`);
                let h5 = $(`<h5 class="card-title"></h5>`).append(restaurant.restaurantName);
                let h6 = $(`<h6 class="card-subtitle mb-2 text-muted"></h6>`).append(restaurant.genre);
                let address = $('<address></address>').append(`${restaurant.country} <br> ${restaurant.city} <br> ${restaurant.address} <br>`);
                let restaurantRating = $('<div class="restaurantRating"></div>')
                    .append(`<span class="fa fa-star checked">
                    ${restaurant.TotalRating ?  restaurant.TotalRating : 'No reviews yet'}</span>`);
                let reviewButton = $(`<button class="btn btn-primary reviewButton" data-toggle="modal" data-target="#reviewModal"
                     data-id="<%= data[i].id %>"></button>`)
                    .text('Reviews')
                    .attr('data-id', restaurant.id);
                cardBody.append(h5, h6, address, restaurantRating, reviewButton);
                cardSlot.append(img, cardBody);

                $('.restaurants-cards').append(cardSlot);
            }
        }
    });

    $('#getTop10').on('click', async (event) => {
        let data = await fetch(`${URL}/api/v1/top10`).then(response => response.json());

        // Clear previous data
        $('.restaurants-cards').empty();

        // if the total we got is 0.
        if (data.result.length == 0) {
            $('.restaurants-cards').append(`<h1></h1>`).text(`No restaurants found!`);
        }

        for (let restaurant of data.result) {

            let cardSlot = $('<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 cardSlot">').attr('data-id',
                restaurant.id);
            let img = $(`<img src="" class="card-img-top" alt="...">`).attr('src', restaurant.avatar);
            let cardBody = $(`<div class="card-body"></div>`);
            let h5 = $(`<h5 class="card-title"></h5>`).append(restaurant.restaurantName);
            let h6 = $(`<h6 class="card-subtitle mb-2 text-muted"></h6>`).append(restaurant.genre);
            let address = $('<address></address>').append(`${restaurant.country} <br> ${restaurant.city} <br> ${restaurant.address} <br>`);
            let restaurantRating = $('<div class="restaurantRating"></div>')
                .append(`<span class="fa fa-star checked">
                    ${restaurant.TotalRating ?  restaurant.TotalRating : 'No reviews yet'}</span>`);
            let reviewButton = $(`<button class="btn btn-primary reviewButton" data-toggle="modal" data-target="#reviewModal"
                     data-id="<%= data[i].id %>"></button>`)
                .text('Reviews')
                .attr('data-id', restaurant.id);
            cardBody.append(h5, h6, address, restaurantRating, reviewButton);
            cardSlot.append(img, cardBody);

            $('.restaurants-cards').append(cardSlot);
        }
    })

    // fixes an login modal, so when you press the login button, an login modal pops upp.
    $('#loginModal').on('shown.bs.modal', function () {
        $('#loginModal').trigger('focus');
    });
    // Clear all messages
    $('#loginModal').on('hide.bs.modal', function () {
        $('.messages').empty();
    });

    // opens a modal when you click on the Reviews Button
    $('.restaurants-cards').on('click', async (event) => {
        if (event.target.classList.contains('reviewButton')) {
            // Clear all previous data
            $('#reviews').empty();
            $('#reviewTitle').empty();
            $('#userRatings').removeClass('is-invalid is-valid');
            $('#reviewText').removeClass('is-invalid is-valid');

            // Get id from dataset
            let id = event.target.dataset.id;

            // Set id to add Review button:
            $('#addReview').attr('data-id', id);
            // Get data from API.
            let data = await fetch(`${URL}/api/v1/getReviews/${id}`).then(response => response.json());
            if (data.response == "ERROR") {
                return;
            }
            // If user is authenticated, show that the user can post a review.
            if (authenticated) {
                $('#postReview').removeClass('d-none');
            } else {
                $('#postReview').addClass('d-none');
            }

            // Add restaurant name
            $('#reviewTitle').text(data.result.restaurantName);

            // Make sure we don't have empty data.
            if (data.result.reviews[0].id == null) {
                return;
            }

            // Add all reviews
            for (let review of data.result.reviews) {
                let html = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
                html.text(review.text);
                html.append(`<span class="badge badge-primary badge-pill">${review.rating}/5</span>`);

                $('#reviews').append(html);
            }
        }

    });

    // Get all forms that got the class needs-validation
    let forms = $('.needs-validation');

    $(forms).on('submit', async (event) => {
        // prevent default (aka. reload page or go to form action path).
        event.preventDefault();
        // Checks validation from HTML5 properties of the input-fields
        if (event.target.checkValidity()) {
            if (event.target.id == "login") {
                let data = await postLogin();
                authenticated = data.loginSucessfull;
                if (data.isAdmin == true) {
                    isAdmin = true;
                }
            } else if (event.target.id == "newAccount") {
                newAccount();
            }
        }
    });

    $('#navbarNav').on('click', (event) => {
        if (event.target.classList.contains('logoutButton')) {
            toggleLoginLogoutButton();
            if (isAdmin) {
                toggleAdminButton();
            }
            fetch(`${URL}/api/v1/logout`);
            authenticated = false;
            isAdmin = false;
        }
    });

    // Get element of id 
    let checkNewAccountForm = $('#newAccount');

    let timerForEmail;

    let checks = {
        emailChecked: false,
        passwordChecked: false,
        passwordRepeatChecked: false
    };

    // when keyup event is fired inside element
    $(checkNewAccountForm).on('keyup', async (event) => {

        if (event.target.id == "newEmail") {

            // Simple email check. 
            let emailPattern = /\S*[^@]@[a-z0-9\.]+/i;

            // if the regexp matches
            if (event.target.value.match(emailPattern)) {
                // cleartimeout
                clearTimeout(timerForEmail);
                // set timeout
                timerForEmail = setTimeout(async function () {
                    // get value from input field
                    let value = event.target.value;

                    // make api call to check if mail exists
                    let response = await fetch(`${URL}/api/v1/emailExist/${value}`).then(response => response.json());

                    // if it exisist
                    if (response.result.exist) {
                        // inform the user that the email is already used.
                        changeValidation(event.target, false);
                        checks.emailChecked = false;
                    } else {
                        // Inform the user that the email is not used.
                        changeValidation(event.target, true);
                        checks.emailChecked = true;
                    }
                }, 500);
            }
            // regex does not maches
            else {
                // inform the user that it's invalid mail
                changeValidation(event.target, false);
            }
        } else if (event.target.id == "newPassword") {

            // check if password meets the requirements. see .env for requirements.
            if ($('#newPassword')[0].value.length >= passwordRequirements.passwordMinimumLength &&
                $('#newPassword')[0].value.match(passwordRequirements.passwordComplexity)
            ) {
                // If both requirements are fufilled inform the user 
                changeValidation($('#newPassword'), true);
                checks.passwordChecked = true;
            } else {
                // If any of the requirements fails, inform the user.
                changeValidation($('#newPassword'), false);
                checks.passwordChecked = false;
            }
        }
        // if event target is ether newPassword or newPasswordRepeat
        // and if length of both passwords exceed 0
        if (
            (event.target.id == "newPassword" ||
                event.target.id == "newPasswordRepeat"
            ) &&
            (
                $('#newPassword')[0].value.length > 0 &&
                $('#newPasswordRepeat')[0].value.length > 0
            )
        ) {
            // Check if both passwords are equal
            if ($('#newPassword')[0].value == $('#newPasswordRepeat')[0].value) {
                changeValidation($('#newPasswordRepeat'), true);
                checks.passwordRepeatChecked = true;
            } else {
                changeValidation($('#newPasswordRepeat'), false);
                checks.passwordRepeatChecked = false;
            }
        }

        // Checks if everything are OK.
        if (checks.emailChecked == true &&
            checks.passwordChecked == true &&
            checks.passwordRepeatChecked == true
        ) {
            // if everything are ok. Enable submit button.
            $(`#newAccount button:submit`)[0].disabled = false;
        } else {
            // if anything isn't ok. Disable submit button
            $(`#newAccount button:submit`)[0].disabled = true;
        }

    });


    $('#postReview').on('submit', async (event) => {
        let rating = $("#postReview").find('.checked').length;
        let reviewText = $("#reviewText").val();
        let id = $('#addReview').data('id')
        if (rating == 0) {
            changeValidation('#userRatings', false);
        } else {
            changeValidation('#userRatings', true);
        }
        if (reviewText == "") {
            changeValidation('#reviewText', false);
        } else {
            changeValidation('#reviewText', true);
        }

        if (!($('#userRatings.is-valid').length &&
                $('#reviewText.is-valid').length)) {
            return;
        }
        let data = {
            rating: Number(rating),
            reviewText: reviewText
        }

        let responseData = await postData(`${URL}/api/v1/postRating/${id}`, data);
        if (responseData.response == "ERROR") {
            return;
        }

        let html = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
        html.text(reviewText);
        html.append(`<span class="badge badge-primary badge-pill">${rating}/5</span>`);

        $('#reviews').append(html);
    });
});
/**
 * Changes class 'is-valid' and 'is-invalid' 
 * @param {string or $(jqueryObject)} target 
 * @param {boolean} isValid 
 */
function changeValidation(target, isValid) {
    if (isValid) {
        $(target).addClass('is-valid');
        $(target).removeClass('is-invalid')
    } else {
        $(target).addClass('is-invalid');
        $(target).removeClass("is-valid");
    }
}
/**
 *  Posts new account to api.
 */
async function newAccount() {
    let email = $('#newEmail').val();
    let password = $('#newPassword').val();

    let data = {
        email: email,
        password: password
    };
    let responseData = await postData(`${URL}/account/newAccount`, data);

    if (responseData.response != 'OK') {
        let message = $('<div class="alert alert-danger m-1" role="alert"></div>').text("Error when creating account");
        $('.messages').append(message);
    } else {
        let message = $('<div class="alert alert-success m-1" role="alert"></div>').text("Your account has been sucessfully created!");
        $('.messages').append(message);
    }
}

/**
 * Posts login to api.
 */
async function postLogin() {
    let inputFields = $('.needs-validation * :input').not(':input[type=button], :input[type=submit]');
    let dataObject = {};
    let returnObject = {
        loginSucessfull: false,
    }
    for (let element of inputFields) {
        dataObject[element.name] = element.value;
    }
    let data = await postData(`${URL}/account/login`, dataObject);
    if (data.response != 'OK') {
        let message = $('<div class="alert alert-danger m-1" role="alert"></div>').text("Error when creating account");
        $('.messages').append(message);
        return returnObject;
    }
    let message = $('<div class="alert alert-success m-1" role="alert"></div>').text("You sucessfully logged in!");
    $('.messages').append(message);

    // Hide login modal
    $('#loginModal').modal('hide');

    toggleLoginLogoutButton();
    returnObject.loginSucessfull = true;

    if (data.result.isAdmin != undefined && data.result.isAdmin == true) {
        toggleAdminButton();
        returnObject.isAdmin = true;
    }
    return returnObject;
}

/**
 * Posts data to url.
 * @param {string} url 
 * @param {object} data 
 */
async function postData(url, data) {
    let responseData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    return responseData;
}

function toggleAdminButton() {
    let adminButton = $('.adminLink');
    if (adminButton.hasClass('d-none')) {
        adminButton.removeClass('d-none');
    } else {
        adminButton.addClass('d-none');

    }
}

function toggleLoginLogoutButton() {
    let loginButton = $('.loginButton');
    let logoutButton = $('.logoutButton');
    if (loginButton.length) {
        loginButton.parent().append(`<button class="btn btn-primary logoutButton">Logout</button>`);
        loginButton.remove();
    } else if (logoutButton.length) {
        logoutButton.parent().append(`<button class="btn btn-primary loginButton" data-toggle="modal" data-target="#loginModal">Login</button>`);
        logoutButton.remove();
    }
}