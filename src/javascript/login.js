$().ready(() => {
    let forms = $('.needs-validation');
    console.log(forms);
    $(forms).on('submit',(event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.target.checkValidity()) {
           
        }
        $(event.target).addClass('was-validated');
    });
});