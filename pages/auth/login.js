"use strict";

/* ==========================================================
   ONEPWS LOGIN
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const forgotPasswordBtn =
        document.getElementById("forgotPasswordBtn");

    const loginMessage =
        document.getElementById("loginMessage");


    /* ======================================================
       SHOW / HIDE PASSWORD
    ====================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

            }

        });

    }


    /* ======================================================
       LOGIN
    ====================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const userId =
                document.getElementById("userId").value.trim();

            const password =
                document.getElementById("password").value;


            /* Clear previous message */

            if (loginMessage) {

                loginMessage.textContent = "";

                loginMessage.style.color = "";

            }


            /* ==================================================
               CHECK CREDENTIALS
               ================================================== */

            if (
                userId.toUpperCase() === "ONEPWS" &&
                password === "ONEPWS"
            ) {

                /* Create login session */

                sessionStorage.setItem(
                    "loggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "userId",
                    "ONEPWS"
                );

                sessionStorage.setItem(
                    "userRole",
                    "USER"
                );


                /* Go to Dashboard */

                window.location.href =
                    "../dashboard/dashboard.html";

                return;

            }


            /* ==================================================
               WRONG LOGIN
               ================================================== */

            if (loginMessage) {

                loginMessage.textContent =
                    "Invalid User ID or Password.";

                loginMessage.style.color =
                    "#dc2626";

            }

        });

    }


    /* ======================================================
       FORGOT PASSWORD
    ====================================================== */

    if (forgotPasswordBtn) {

        forgotPasswordBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Password recovery will be available after the email system is connected."
                );

            }
        );

    }

});