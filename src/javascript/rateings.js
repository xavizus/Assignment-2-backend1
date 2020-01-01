$().ready(() => {

    let settings = {
        currentValue: 0
    };

    let wonderfullFunctions = {
        fill: (element) => {
            let index = $(".fa-star").index(element) + 1;
            $(".fa-star").slice(0, index).addClass('hover');
        },
        clear: () => {
            $(".fa-star").filter('.hover').removeClass('hover');
            $(".fa-star").filter('.checked').removeClass('checked');
        },
        reset: () => {
            $('.fa-star').slice(0, settings.currentValue).addClass('checked');
        }
    };

    $('#reviewModal').on('hide.bs.modal', function () {
        wonderfullFunctions.clear();
        settings.currentValue = 0;
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
        settings.currentValue = index;
        wonderfullFunctions.reset();
    });
});