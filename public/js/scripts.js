var translation = {};

$(document).ready(function() {
  $.ajax({
    type: "POST",
    url: "/getLanguageJSON",
    data: null,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    success: data => {
      Object.assign(translation, data);
    },
    error: data => {
      console.log(data);
    }
  });
});

// Login button

$("#login-button").click(function(e) {
  let email = document.getElementById("loginModalEmail").value;
  let password = document.getElementById("loginModalPassword").value;

  data = {
    email: email,
    password: password
  };

  JSON.stringify(data);

  if (!(email === "")) {
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let result = pattern.test(email);
    if (result) {
      if (password !== "") {
        $.ajax({
          type: "POST",
          url: "/login",
          data: data,
          dataType: "json",
          contentType: "application/x-www-form-urlencoded",
          success: data => {
            if (data.length <= 3) {
              window.location.href = data;
            } else {
              document.getElementById("login-alert-section").innerHTML = data;
            }
          },
          error: data => {
            console.log(data);
          }
        });
      } else {
        document.getElementById("login-alert-section").innerHTML =
          translation.signUpInfo.youMustEnterAPassword;
      }
    } else {
      document.getElementById("login-alert-section").innerHTML =
        translation.signUpInfo.yourEmailIsWrong;
    }
  } else {
    password = document.getElementById("login-alert-section").innerHTML =
      translation.signUpInfo.youMustEnterAnEmail;
  }
});

// Sign out button

$("#signout-button").click(function(e) {
  $.ajax({
    type: "POST",
    url: "/signout",
    data: null,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    success: data => {
      window.location.href = data;
    },
    error: data => {
      console.log(data);
    }
  });
});

// Sign up form verification
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
      // Pattern verifies:
      // An @, something after and before the @, a dot '.' after whatever comes after @, and something after the dot.
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
                  if (data.length <= 3) {
                    window.location.href = data;
                  } else {
                    document.getElementById(
                      "signup-alert-section"
                    ).innerHTML = data;
                  }
                },
                error: data => {
                  document.getElementById(
                    "signup-alert-section"
                  ).innerHTML = data;
                }
              });
            } else {
              document.getElementById("signup-alert-section").innerHTML =
                translation.signUpInfo.passwordDoesntMatch;
            }
          } else {
            document.getElementById("signup-alert-section").innerHTML =
              translation.signUpInfo.youMustConfirmYourPassword;
          }
        } else {
          document.getElementById("signup-alert-section").innerHTML =
            translation.signUpInfo.youMustEnterAPassword;
        }
      } else {
        document.getElementById("signup-alert-section").innerHTML =
          translation.signUpInfo.yourEmailIsWrong;
      }
    } else {
      document.getElementById("signup-alert-section").innerHTML =
        translation.signUpInfo.youMustEnterAnEmail;
    }
  } else {
    document.getElementById("signup-alert-section").innerHTML =
      translation.signUpInfo.youMustEnterAnUser;
  }
});

// Sign up form cleaning if closed
$("#signup-dismiss").click(function(e) {
  e.preventDefault();
  document.getElementById("signupModalUsername").innerHTML = "";
  document.getElementById("signupModalEmail").innerHTML = "";
  document.getElementById("signupModalPassword").innerHTML = "";
  document.getElementById("signupModalConfirmPassword").innerHTML = "";
});

// Contact us toggling info
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
