// Contact us toggling info
$("#signup-button").click(function(e) {
  let username = document.getElementById("signupModalUsername").value;
  let email = document.getElementById("signupModalEmail").value;
  let password = document.getElementById("signupModalPassword").value;
  let confirmedPassword = document.getElementById("signupModalConfirmPassword")
    .value;
  let data = {
    username: username,
    email: email,
    password: password
  };
  JSON.stringify(data);

  if (!(username === "") || !username === "Username") {
    if (!(email === "")) {
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      result = pattern.test(email);
      if (result) {
        if (!(password === "")) {
          if (!(confirmedPassword === "")) {
            if (password === confirmedPassword) {
              $.ajax({
                type: "POST",
                url: "/signup",
                data: data,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                success: data => {
                  window.location.href = data.redirectLink;
                }
              });
            } else {
              document.getElementById("signup-alert-section").innerHTML =
                "Las contraseñas no coinciden.";
            }
          } else {
            document.getElementById("signup-alert-section").innerHTML =
              "Debes confirmar tu contraseña.";
          }
        } else {
          document.getElementById("signup-alert-section").innerHTML =
            "Debes ingresar una contraseña.";
        }
      } else {
        document.getElementById("signup-alert-section").innerHTML =
          "El correo no es válido. Verifica que esté bien escrito. \n Ejemplo: user@useremail.com";
      }
    } else {
      document.getElementById("signup-alert-section").innerHTML =
        "Debes ingresar un correo.";
    }
  } else {
    document.getElementById("signup-alert-section").innerHTML =
      "Debes ingresar un usuario.";
  }
});

$("#howToUploadASoftware").hide();
$("#howToUploadABook").hide();
$("#howLongDoesItTakesForAnAnswer").hide();
$("#whereToFindCookiesAndUserAgreement").hide();
$("#whereToFindAModerator").hide();

$("#toggle-howToUploadASoftware").click(function(e) {
  $("#howToUploadASoftware").slideToggle();
});
$("#toggle-howToUploadABook").click(function(e) {
  $("#howToUploadABook").slideToggle();
});
$("#toggle-howLongDoesItTakesForAnAnswer").click(function(e) {
  $("#howLongDoesItTakesForAnAnswer").slideToggle();
});
$("#toggle-whereToFindCookiesAndUserAgreement").click(function(e) {
  $("#whereToFindCookiesAndUserAgreement").slideToggle();
});
$("#toggle-whereToFindAModerator").click(function(e) {
  $("#whereToFindAModerator").slideToggle();
});

// Software comment toggling

$("#post-comment").hide();

$("#btn-toggle-comment").click(function(e) {
  $("#post-comment").slideToggle();
});

// Software delete button function

$("button[id=btn-delete]").click(function() {
  let $this = $(this);
  const response = confirm("¿Estás seguro de eliminar esta imagen?");
  if (response) {
    let softId = $this.data("id");
    $.ajax({
      url: `/software/${softId}/delete`,
      type: "DELETE"
    }).done(function(result) {
      $this.removeClass("btn-danger").addClass("btn-success");
      $this
        .find("i")
        .removeClass("fa-times")
        .addClass("fa-check");
      $this.append("<span>Eliminado!</span>");
    });
  }
});

// Software like button

$("button[id=btn-like]").click(function() {
  let softid = $(this).data("id");

  $.post(`/software/${softid}/like`).done(data => {
    $(".likes-count").text(data.likes);
  });
});
