$().ready(() => {

    let currentValue = 0;


    let wonderfullFunctions = {
        // Fill function used for filling the star when hovering
        fill: (element) => {
            let index = $(".fa-star").index(element) + 1;
            $(".fa-star").slice(0, index).addClass('hover');
        },
        // clear both checked and hovered stars
        clear: () => {
            $(".fa-star").filter('.hover').removeClass('hover');
            $(".fa-star").filter('.checked').removeClass('checked');
        },
        // Resets to default value.
        reset: () => {
            $('.fa-star').slice(0, currentValue).addClass('checked');
        }
    };

    $('#reviewModal').on('hide.bs.modal', function () {
        wonderfullFunctions.clear();
        currentValue = 0;
    });

    $(".fa-star").mouseenter((event) => {
        event.preventDefault();
        wonderfullFunctions.clear();
        wonderfullFunctions.fill(event.target);
    });

    $(".fa-star").mouseleave((event) => {
        event.preventDefault();
        wonderfullFunctions.clear();
        wonderfullFunctions.reset();
    });

    $('.fa-star').click((event) => {
        event.preventDefault();
        let index = $(".fa-star").index(event.target) + 1;
        currentValue = index;
        wonderfullFunctions.reset();
    });
});