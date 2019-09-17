$(".dropdown-trigger").dropdown();
$('#post-comment').hide();

// Contact us toggling info
$('#howToUploadASoftware').hide();
$('#howToUploadABook').hide();
$('#howLongDoesItTakesForAnAnswer').hide();
$('#whereToFindCookiesAndUserAgreement').hide();
$('#whereToFindAModerator').hide();

$('#toggle-howToUploadASoftware').click(function(e){
    $('#howToUploadASoftware').slideToggle();
});

$('#toggle-howToUploadABook').click(function(e){
    $('#howToUploadABook').slideToggle();
});

$('#toggle-howLongDoesItTakesForAnAnswer').click(function(e){
    $('#howLongDoesItTakesForAnAnswer').slideToggle();
});

$('#toggle-whereToFindCookiesAndUserAgreement').click(function(e){
    $('#whereToFindCookiesAndUserAgreement').slideToggle();
});

$('#toggle-whereToFindAModerator').click(function(e){
    $('#whereToFindAModerator').slideToggle();
});

// Software comment toggling

$('#btn-toggle-comment').click(function(e){
    $('#post-comment').slideToggle();
});


// Software delete event listening

$("button[id=btn-delete]").click(function(){
    let $this = $(this);
    const response = confirm('¿Estás seguro de eliminar esta imagen?');
    if (response) {
        let softId = $this.data('id');
        $.ajax({
            url: `/software/${softId}/delete`,
            type: 'DELETE'
        })
        .done(function(result){
            $this.removeClass('btn-danger').addClass('btn-success');
            $this.find('i').removeClass('fa-times').addClass('fa-check');
            $this.append('<span>Eliminado!</span>');
        });
    }
});

// Software like event listening

$("button[id=btn-like]").click(function() {
    let softid = $(this).data('id');

    $.post(`/software/${softid}/like`).done(data => {
        $('.likes-count').text(data.likes);
    });
});
