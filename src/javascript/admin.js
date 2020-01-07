// Create apiURL
// First get protocol, then get hostname, 
// then check if there is a port. if it exists, add colon and portnumber
// lastly, path to api.
let URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;

$().ready(() => {
    //Ugly solution to add "add Restaurant button" to admin-view.
    let listItem = $(' <li class="nav-item"> </li>');
    let button = $('<button class="btn btn-primary mr-1" data-toggle="modal" data-target="#addRestaurantsModal"></button')
    .text('Add restaurant');
    listItem.append(button);

    listItem.insertAfter('.adminLink');

    $('.restaurants-cards').on('click', async (event) => {
        if (event.target.classList.contains('editRestaurant')) {
            // Clear all previous data
            let inputs = ['restaurantName', 'country', 'city', 'address', 'geners', 'generToAdd'];
            for (let input of inputs) {
                $(`#${input}`).empty();
                $(`#${input}`).removeClass('is-invalid is-valid');
            }

            // get restaurantId from event
            let restaurantId = event.target.dataset.id;

            // fetch data about the restaurant
            let data = await fetch(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());

            if (data.result.found == false) {
                console.error("RestaurantId not found!");
                return;
            }

            // Go through all our inputs, and fill them with the current data.
            for (let input of inputs) {
                $(`#${input}`).val(data.result[input]);
            }

            // get geners by restaurantid
            let responseData = await fetch(`${URL}/api/v1/genersById/${restaurantId}`).then(response => response.json());

            // store geners array
            let geners = responseData.result.geners;
            if (responseData.result.found != false) {

            // loop through geners and create list element
            for (let gener of geners) {
                let newElement = $(`<li class="list-group-item" data-id="${gener.gener_id}"></li>`)
                    .text(gener.genreName)
                    .append(`<i class="material-icons float-right mr-1 pointer deleteGener" data-id="${gener.gener_id}">delete</i>`);

                $('#geners').append(newElement);
            }
            }

            // get all Geners that exists
            responseData = await fetch(`${URL}/api/v1/allGeners`).then(response => response.json());

            if (responseData.result.found == false) {
                console.log("No data");
                return;
            }

            // store all geners array
            let allGeners = responseData.result.geners;
            
            // sort allGeners
            allGeners.sort((a, b) => (a.genreName.toUpperCase() > b.genreName.toUpperCase()) ? 1 : -1);
            
            // Create select element
            let selectList = $('<select id="selectGenerToAdd" class="form-control"></select>');

            // Loop through all geners and show the geners that's not maches the current
            // geners that the restaurant already got.
            for (let gener of allGeners) {
                if (geners == undefined || (geners.findIndex((currentValue) => currentValue.gener_id == gener.id) == -1)) {
                    let option = $('<option/>')
                        .text(gener.genreName)
                        .attr('data-id', gener.id);
                    selectList.append(option);
                }
            }
            $('#generToAdd').append(selectList);

            // Last resort. Add restaurantId to the form
            $('#editRestaurantForm').attr('data-restaurantId', `${restaurantId}`);


        } else if (event.target.classList.contains('removeRestaurant')) {
            let restaurantId = event.target.dataset.id;
            let data = await fetch(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());
            
            $('#deleteRestaurantName').text(data.result.restaurantName);

            $('#deleteRestaurant').attr('data-id', restaurantId);
        }
    });

    // Handles click events inside delete restaurant modal

    $('#deleteRestaurantsModal').on('click', async(event) => {
        if(event.target.id == "deleteRestaurant") {
            let restaurantId = event.target.dataset.id;

            let responseData = await sendData(`${URL}/api/v1/deleteRestaurant/${restaurantId}`, 'DELETE');

            $('#deleteRestaurantsModal').modal('hide');

            let messageElement = $('<div class="alert" role="alert"></div>');

            if(responseData.response == 'ERROR') {
                messageElement.addClass('alert-danger')
                .text(responseData.error);
            }
            else {
                messageElement.addClass('alert-success')
                .text(responseData.result);
                $(`.cardSlot[data-id='${restaurantId}'`).remove();
            }

            $('#systemMessages').append(messageElement);

        }
        
    });


    // handles click event inside edit restaurant modal.
    $('#editRestaurantModal').on('click', async (event) => {

        // adds selected gener to geners.
        if (event.target.id == 'addGener') {
            let id = $('#generToAdd option:selected').data('id');
            let text = $('#generToAdd option:selected').text();
            $('#generToAdd option:selected').remove();

            let newElement = $(`<li class="list-group-item" data-id="${id}"></li>`)
                .text(text)
                .append(`<i class="material-icons float-right mr-1 pointer deleteGener" data-id="${id}">delete</i>`);

            $('#geners').append(newElement);
        }

        // removes a gener from geners list and add it to add gener select list
        else if (event.target.classList.contains('deleteGener')) {
            let id = $(event.target).data('id');
            let text = $(event.target).parent().text();
            $(event.target).parent().remove();
            text = text.substring(0,text.indexOf('delete'));
            let option = $('<option/>')
                        .text(text)
                        .attr('data-id', id);
            $('#selectGenerToAdd').append(option);
        }

        // Post data on submit.
        else if (event.target.type == 'submit') {
            let dataObject = {};

            let objectsToGetDataFrom = ['restaurantName', 'country', 'city', 'address', 'geners'];

            for (let object of objectsToGetDataFrom) {
                if (object == 'geners') {
                    dataObject.geners = [];
                    let genersToAdd = $(`#${object} li`);
                    for (let gener of genersToAdd) {
                        dataObject.geners.push($(gener).data('id'));
                    }
                } else {
                    dataObject[object] = $(`#${object}`).val();
                }
            }
            let restaurant_id = $('#editRestaurantForm').attr('data-restaurantId');

            let responseData = await sendData (`${URL}/api/v1/updateRestaurant/${restaurant_id}`, 'PUT', dataObject);
            let messages = $('.updateMessages');
            if(responseData.response == "ERROR") {
                let errorMessage = $('<div class="alert alert-danger" role="alert"></div>')
                .text(responseData.error);

                messages.append(errorMessage);
                return;
            }

            let sucessfullMessage = $('<div class="alert alert-success" role="alert"></div>')
            .text(responseData.result);

            console.log(sucessfullMessage);
            console.log(messages);
            messages.append(sucessfullMessage);
        }
    });

});


/**
 * POST/PUT/DELETE data to url.
 * @param {string} url 
 * @param {object} data 
 */
async function sendData(url,method, data = {}) {
    let responseData = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    return responseData;
}