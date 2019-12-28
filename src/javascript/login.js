let protocol = location.protocol;
let slashes = protocol.concat("//");
let host = slashes.concat(window.location.hostname);
host = `${host}${location.port ? `:${location.port}` : ''}`;
let apiPath = `${host}/api/v1`;

$().ready(() => {
    $('#loginModal').on('shown.bs.modal', function () {
        $('#loginModal').trigger('focus');
      });


    let forms = $('.needs-validation');
    console.log(forms);
    $(forms).on('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.target.checkValidity()) {
            postLogin();
        }
        $(event.target).addClass('was-validated');
    });
});

async function postLogin() {
    let inputFields = $('.needs-validation * :input').not(':input[type=button], :input[type=submit]');

    let dataObject = {};
    for (let element of inputFields) {
        dataObject[element.name] = element.value;
    }
    let data = await postData(`${apiPath}/requestToken`, dataObject);

    console.log(data);
}

async function postData(url, data) {
    let responseData = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    return responseData;
}