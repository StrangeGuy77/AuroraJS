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

  // Facebook analytics

  window.fbAsyncInit = function() {
    window.FB.init({
      appId: "1006997812969524",
      cookie: true,
      xfbml: true,
      version: "v4.0"
    });

    window.FB.AppEvents.logPageView();
  };

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
});

function statusChangeCallback(response) {
  if (response.status === "connected") {
    // Logged into your app and Facebook.
    FB.api("/me", function(response) {
      response.from = "facebook";
      $.ajax({
        type: "POST",
        url: "/signup",
        data: response,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        success: data => {
          if (data.length <= 3) {
            window.location.href = data;
          } else {
            document.getElementById("signup-alert-section").innerHTML = data;
          }
        },
        error: data => {
          document.getElementById("signup-alert-section").innerHTML = data;
        }
      });
    });
  } else {
    // The person is not logged into your app or we are unable to tell.
    document.getElementById("signup-alert-section").innerHTML =
      "There was an error login with facebook.";
  }
}

// Signup with facebook
function checkLoginState() {
  var response = {};
  window.FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

// // Sign in with google

// Login button

$("#login-button").click(function(e) {
  let email = document.getElementById("loginModalEmail").value;
  let password = document.getElementById("loginModalPassword").value;

  const data = {
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

  if (!(username === "") || !(username === "Username")) {
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
      type: "DELETE",
      success: data => {
        window.location.href = data;
      },
      error: data => {
        console.log(data);
      }
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

// Profile Settings Saving Control

$("#saveSettings").click(function(e) {
  let userSettings = {
    name: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    cellphone: document.getElementById("cellphone").value,
    email: document.getElementById("email").value,
    worksite: document.getElementById("worksite").value,
    enterprise: document.getElementById("enterprise").value,
    country: document.getElementById("country").value,
    city: document.getElementById("city").value,
    changePassword: document.getElementById("changepassword").value,
    confirmPassword: document.getElementById("confirmpassword").value,
    github: document.getElementById("usergithub").value,
    webpage: document.getElementById("userwebpage").value,
    show_public_name: document.getElementById("showpublicname").checked,
    show_public_email: document.getElementById("showpublicemail").checked,
    show_public_location: document.getElementById("showpubliclocation").checked
  };

  function checkProperties(obj) {
    let objectToReturn = {
      emptyProperties: 0,
      emptyPropertyValues: []
    };
    for (var key in obj) {
      if (obj[key] === null || obj[key] === "") {
        objectToReturn.emptyProperties += 1;
        objectToReturn.emptyPropertyValues[key] = obj[key];
      }
    }
    return objectToReturn;
  }

  let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  result = pattern.test(userSettings.email);

  // If userSettings ain't completely empty
  if (checkProperties(userSettings).emptyProperties === 12) {
    JSON.stringify(userSettings);
    $.ajax({
      type: "POST",
      url: "/save-settings",
      data: userSettings,
      dataType: "json",
      contentType: "application/x-www-form-urlencoded",
      success: data => {
        if (data.length <= 3) {
          window.location.href = data;
        } else {
          document.getElementById("settingsWarning").innerHTML = data;
        }
      },
      error: data => {
        document.getElementById("settingsWarning").innerHTML = data;
      }
    });
  } else {
    // Verify if user wants to change its password
    if (
      userSettings.changePassword !== "" ||
      userSettings.confirmPassword !== ""
    ) {
      // If none of both fields are empty
      if (
        userSettings.changePassword !== "" &&
        userSettings.confirmPassword !== "" &&
        userSettings.changePassword === userSettings.confirmPassword
      ) {
        if (result) {
          userSettings.withPassword = true;
          JSON.stringify(userSettings);
          $.ajax({
            type: "POST",
            url: "/save-settings",
            data: userSettings,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: data => {
              if (data.length <= 3) {
                window.location.href = data;
              } else {
                document.getElementById("settingsWarning").innerHTML = data;
              }
            },
            error: data => {
              document.getElementById("settingsWarning").innerHTML = data;
            }
          });
        } else {
          document.getElementById("settingsWarning").innerHTML =
            translation.signUpInfo.yourEmailIsWrong;
        }
        // If any of both fields are empty check which it is, then, advice the user.
      } else if (userSettings.changePassword === "") {
        document.getElementById("settingsWarning").innerHTML =
          translation.signUpInfo.youMustEnterAPassword;
      } else if (userSettings.confirmPassword === "") {
        document.getElementById("settingsWarning").innerHTML =
          translation.signUpInfo.youMustConfirmYourPassword;
      } else if (userSettings.confirmPassword !== userSettings.changePassword) {
        document.getElementById("settingsWarning").innerHTML =
          translation.signUpInfo.passwordDoesntMatch;
      }
      // Else, if user do not want to change its password, then:
    } else if (userSettings.email !== "") {
      if (result) {
        JSON.stringify(userSettings);
        $.ajax({
          type: "POST",
          url: "/save-settings",
          data: userSettings,
          dataType: "json",
          contentType: "application/x-www-form-urlencoded",
          success: data => {
            if (data.length <= 3) {
              window.location.href = data;
            } else {
              document.getElementById("settingsWarning").innerHTML = data;
            }
          },
          error: data => {
            document.getElementById("settingsWarning").innerHTML = data;
          }
        });
      } else {
        document.getElementById("settingsWarning").innerHTML =
          translation.signUpInfo.yourEmailIsWrong;
      }
    } else {
      userSettings.withPassword = false;
      JSON.stringify(userSettings);
      $.ajax({
        type: "POST",
        url: "/save-settings",
        data: userSettings,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        success: data => {
          if (data.length <= 3) {
            window.location.href = data;
          } else {
            document.getElementById("settingsWarning").innerHTML = data;
          }
        },
        error: data => {
          document.getElementById("settingsWarning").innerHTML = data;
        }
      });
    }
  }
});

let toggleControl = 1;
const checkList = document.getElementById("list1");
checkList.getElementsByClassName("anchor")[0].onclick = function(evt) {
  if (checkList.classList.contains("visible"))
    checkList.classList.remove("visible");
  else checkList.classList.add("visible");
};

checkList.onblur = function(evt) {
  checkList.classList.remove("visible");
};
if ($("#toggleFrameworks")) $("#toggleFrameworks").hide();

$("#language").change(function(e) {
  e.preventDefault();
  $("#softwareDetailsModal").show();
  let language = document.getElementById("language").value;
  let actualClass = document.getElementById("iconToReplace").className;
  switch (language) {
    case "js":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("fab fa-react icon");

      document.getElementById("1stFrame").innerHTML = "React";
      document.getElementById("2ndFrame").innerHTML = "Angular";
      document.getElementById("3rdFrame").innerHTML = "Vue";
      document.getElementById("4thFrame").innerHTML = "React native";
      document.getElementById("5thFrame").innerHTML = "Meteor";

      break;

    case "ruby":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("devicon-rails-plain-wordmark icon");

      document.getElementById("1stFrame").innerHTML = "Ruby on rails";
      document.getElementById("2ndFrame").innerHTML = "Hanami";
      document.getElementById("3rdFrame").innerHTML = "Sinatra";
      document.getElementById("4thFrame").innerHTML = "Cuba";
      document.getElementById("5thFrame").innerHTML = "Nancy";
      break;

    case "python":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("devicon-django-plain icon");

      document.getElementById("1stFrame").innerHTML = "Django";
      document.getElementById("2ndFrame").innerHTML = "Pyramid";
      document.getElementById("3rdFrame").innerHTML = "Turbogears";
      document.getElementById("4thFrame").innerHTML = "Web2py";
      document.getElementById("5thFrame").innerHTML = "Flask";
      break;

    case "cpp":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("devicon-cplusplus-plain icon");

      document.getElementById("1stFrame").innerHTML = "STL";
      document.getElementById("2ndFrame").innerHTML = "GNOME";
      document.getElementById("3rdFrame").innerHTML = "Qt";
      document.getElementById("4thFrame").innerHTML = "MFC";
      document.getElementById("5thFrame").innerHTML = "NET";
      break;

    case "cs":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("devicon-csharp-plain icon");

      document.getElementById("1stFrame").innerHTML = "Xamarin";
      document.getElementById("2ndFrame").innerHTML = "Unity";
      document.getElementById("3rdFrame").innerHTML = "Mono";
      document.getElementById("4thFrame").innerHTML = "NET";
      document.getElementById("5thFrame").innerHTML =
        "Windows platforms (Mac, iOS, Android)";
      break;

    case "c":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("devicon-c-plain icon");

      document.getElementById("1stFrame").innerHTML = "STL";
      document.getElementById("2ndFrame").innerHTML = "GNOME";
      document.getElementById("3rdFrame").innerHTML = "Qt";
      document.getElementById("4thFrame").innerHTML = "MFC";
      document.getElementById("5thFrame").innerHTML = "NET";
      break;

    case "java":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("fas fa-leaf icon");

      document.getElementById("1stFrame").innerHTML = "Spring";
      document.getElementById("2ndFrame").innerHTML = "Blade";
      document.getElementById("3rdFrame").innerHTML = "Dropwizard";
      document.getElementById("4thFrame").innerHTML = "Grails";
      document.getElementById("5thFrame").innerHTML = "GWT";
      break;

    case "php":
      $("#iconToReplace")
        .removeClass(`${actualClass}`)
        .addClass("fab fa-laravel icon");

      document.getElementById("1stFrame").innerHTML = "Laravel";
      document.getElementById("2ndFrame").innerHTML = "Codeigniter";
      document.getElementById("3rdFrame").innerHTML = "Symfony";
      document.getElementById("4thFrame").innerHTML = "CakePHP";
      document.getElementById("5thFrame").innerHTML = "Yii";
      break;

    default:
      break;
  }
  if (language === "empty" || toggleControl === 1) {
    $("#toggleFrameworks").slideToggle();
    toggleControl = 2;
    if (toggleControl === 2 && language === "empty") {
      toggleControl = 1;
    }
  }
});
