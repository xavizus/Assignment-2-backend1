import fetch from "node-fetch";

// Create apiURL
// First get protocol, then get hostname, 
// then check if there is a port. if it exists, add colon and portnumber
// lastly, path to api.
let URL = `${location.protocol}//${window.location.hostname}${location.port ? `:${location.port}` : ''}`;

$().ready(() => {

    $('.restaurants-cards').on('click', async (event) => {
        if (event.target.classList.contains('editRestaurant')) {
            // Clear all previous data
            let inputs = ['restaurantName', 'country', 'city', 'address', 'geners'];
            for (let input of inputs) {
                $(`#${input}`).empty();
                $(`#${input}`).removeClass('is-invalid is-valid');
            }

            let restaurantId = event.target.dataset.id;
            let data = await fetch(`${URL}/api/v1/restaurantById/${restaurantId}`).then(response => response.json());

            if (data.result.found == false) {
                console.error("RestaurantId not found!");
            }

            for (let input of inputs) {
                $(`#${input}`).val(data.result[input]);
            }

            let responseData = await fetch(`${URL}/api/v1/genersById/${restaurantId}`).then(response => response.json());

            if (responseData.result.found == false) {
                console.log("No data");
                return;
            }

            let geners = responseData.result.geners;

            for (let gener of geners) {
                let newElement = $(`<li class="list-group-item" data-id="${gener.id}"></li>`)
                    .text(gener.genreName);

                $('#geners').append(newElement);
            }

            responseData = await fetch(`${URL}/api/v1/allGeners`).then(response => response.json());

            if (responseData.result.found == false) {
                console.log("No data");
                return;
            }

            let allGeners = responseData.result.geners;
            allGeners.sort((a, b) => (a.genreName.toUpperCase() > b.genreName.toUpperCase()) ? 1 : -1);
            let selectList = $('<select id="geners" class="form-control"></select>');
            for (let gener of allGeners) {
                if (geners.findIndex((currentValue) => currentValue.id == gener.id) == -1) {
                    let option = $('<option/>')
                        .text(gener.genreName)
                        .attr('data-id', gener.id);
                    selectList.append(option);
                }
            }
            $('#generToAdd').append(selectList);
        } else if (event.target.classList.contains('removeRestaurant')) {

        }
    });


    $('#editRestaurantModal').on('click', (event) => {
        if (event.target.id == 'addGener') {
            let dataId = $('#generToAdd option:selected').data('id');
            let text = $('#generToAdd option:selected').text();
            $('#generToAdd option:selected').remove();

            let newElement = $(`<li class="list-group-item" data-id="${dataId}"></li>`)
                .text(text);

            $('#geners').append(newElement);
        } else if (event.target.type == 'submit') {
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

            console.log(dataObject);
        }
    });

});