// Create apiURL
// First get protocol, then get hostname, 
// then check if there is a port. if it exists, add colon and portnumber
// lastly, path to api.
let URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;

$().ready(async () => {
    let isTokenValid = await fetch(`${URL}/api/v1/verifyToken`).then(response => response.json());

    if (isTokenValid.response == 'OK') {
        toggleLoginLogoutButton();
    }
    // Get password requirements and jsonfy it
    let passwordRequirements = await fetch(`${URL}/api/v1/passwordRequirements`).then(response => response.json());
    // make the passwordComplexity string into a RexExp.
    passwordRequirements.passwordComplexity = new RegExp(passwordRequirements.passwordComplexity, 'g');

    // fixes an login modal, so when you press the login button, an login modal pops upp.
    $('#loginModal').on('shown.bs.modal', function () {
        $('#loginModal').trigger('focus');
    });
    // Clear all messages
    $('#loginModal').on('hide.bs.modal', function () {
        $('.messages').empty();
    });

    $('.restaurants-cards').on('click', async (event) => {
        if (event.target.classList.contains('reviewButton')) {
            let id = event.target.dataset.id;
            let data = await fetch(`${URL}/api/v1/getReviews/${id}`).then(response => response.json());
            $('#reviews').empty();
            $('#reviewTitle').empty();
            $('#reviewTitle').text(data.result.restaurantName);
            for (let review of data.result.reviews) {
                let html = $('<div class="row"></div>');
                html.append($('<p></p>').text(review.text));

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
                postLogin();
            } else if (event.target.id == "newAccount") {
                newAccount();
            }
        }
    });

    $('.logoutButton').on('click', (event) => {
        console.log('Clicked');
        toggleLoginLogoutButton();
        fetch(`${URL}/api/v1/logout`);
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
    for (let element of inputFields) {
        dataObject[element.name] = element.value;
    }
    let data = await postData(`${URL}/account/login`, dataObject);
    if (data.response != 'OK') {
        let message = $('<div class="alert alert-danger m-1" role="alert"></div>').text("Error when creating account");
        $('.messages').append(message);
        return;
    }
    let message = $('<div class="alert alert-success m-1" role="alert"></div>').text("You sucessfully logged in!");
    $('.messages').append(message);

    // Hide login modal
    $('#loginModal').modal('hide');

    toggleLoginLogoutButton();

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