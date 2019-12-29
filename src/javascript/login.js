import fetch from "node-fetch";

let protocol = location.protocol;
let slashes = protocol.concat("//");
let host = slashes.concat(window.location.hostname);
host = `${host}${location.port ? `:${location.port}` : ''}`;
let apiURL = `${host}/api/v1`;

$().ready(() => {
    $('#loginModal').on('shown.bs.modal', function () {
        $('#loginModal').trigger('focus');
    });
    let forms = $('.needs-validation');
    $(forms).on('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.checkValidity()) {
            if (event.target.id == "login") {
                postLogin();
            } else if (event.target.id == "newAccount") {
                newAccount();
            }
        }
    });

    let checkNewAccountForm = $('#newAccount');
    let timerForEmail;
    let checks = {
        emailChecked: false,
        passwordChecked: false,
        passwordRepeatChecked: false
    };
    $(checkNewAccountForm).on('keyup', async (event) => {

        if (event.target.id == "newEmail") {
            let emailPattern = /\S*[^@]@[a-zA-Z0-9\.]+/i;
            if (event.target.value.match(emailPattern)) {
                clearTimeout(timerForEmail);
                timerForEmail = setTimeout(async function () {
                    let value = event.target.value;
            
                    let response = await fetch(`${apiURL}/emailExist/${value}`).then(response => response.json());
            
                    if (response.result.exist) {
                        changeValidation(event.target,false);
                        checks.emailChecked = false;
                    } else {
                        changeValidation(event.target,true);
                        checks.emailChecked = true;
                    }
                }, 500);
            } else {
                $(event.target).removeClass('is-valid');
                $(event.target).addClass("is-invalid");
            }
        }
        if(event.target.id == "newPassword") {
            if($('#newPassword')[0].value.length >= 6) {
                changeValidation( $('#newPassword'), true);
                checks.passwordChecked = true;
            } else {
                changeValidation( $('#newPassword'), false);
                checks.passwordChecked = false;
            }
        }
        // if event target is ether newPassword or newPasswordRepeat
        // and if length of both passwords exceed 0
        if(
            (event.target.id == "newPassword" || 
            event.target.id == "newPasswordRepeat"
            ) 
            &&
            (
            $('#newPassword')[0].value.length > 0 &&
            $('#newPasswordRepeat')[0].value.length > 0
            )
            ) {
                // Check if both passwords are equal
            if($('#newPassword')[0].value == $('#newPasswordRepeat')[0].value) {
                changeValidation( $('#newPasswordRepeat'), true);
                checks.passwordRepeatChecked = true;
            } 
            else {
                changeValidation( $('#newPasswordRepeat'),false);
                checks.passwordRepeatChecked = false;
            }
        }

        if(checks.emailChecked == true &&
            checks.passwordChecked == true &&
            checks.passwordRepeatChecked == true
            ) {
                $(`#newAccount button:submit`)[0].disabled = false;
            }
            else {
                $(`#newAccount button:submit`)[0].disabled = true;
            }

    });
});

function changeValidation(target, isValid) {
    if(isValid) {
        $(target).addClass('is-valid');
        $(target).removeClass('is-invalid')
    }
    else {
        $(target).addClass('is-invalid');
        $(target).removeClass("is-valid");
    }
}

async function newAccount() {
    let email = $('#newEmail').value;
    let password = $('#newPassword').value;

    let postData = {email: email, password: password};

    let response = await fetch(`${apiURL}/createNewAccount`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
}

async function postLogin() {
    let inputFields = $('.needs-validation * :input').not(':input[type=button], :input[type=submit]');

    let dataObject = {};
    for (let element of inputFields) {
        dataObject[element.name] = element.value;
    }
    let data = await postData(`${apiURL}/requestToken`, dataObject);

    console.log(data);
}

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