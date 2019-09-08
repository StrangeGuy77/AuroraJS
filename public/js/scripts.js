$("button[id=btn-like]").click(function() {
    let softid = $(this).data('id');

    $.post(`/software/${softid}/like`).done(data => {
        $('.likes-count').text(data.likes);
    });
});

$('#post-comment').hide();

$('#btn-toggle-comment').click(function(e){
    e.preventDefault();
    $('#post-comment').slideToggle();
});

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
    } else {
        
    }
});