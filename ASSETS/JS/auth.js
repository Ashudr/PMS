"use strict";

/* ==========================================================
   ONEPWS AUTHENTICATION SYSTEM
   ========================================================== */

/*
   DEMO LOGIN CREDENTIALS

   Normal User:
   ID       : ONEPWS
   Password : ONEPWS

   Master:
   ID       : MASTER
   Password : ONEPWS
*/

const AUTH_USERS = {

    ONEPWS: {
        password: "ONEPWS",
        role: "USER",
        name: "ONEPWS User"
    },

    MASTER: {
        password: "ONEPWS",
        role: "MASTER",
        name: "Master Administrator"
    }

};


/* ==========================================================
   LOGIN INITIALIZATION
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

});


/* ==========================================================
   LOGIN FUNCTION
   ========================================================== */

function handleLogin(event) {

    event.preventDefault();

    const userId =
        document.getElementById("userId")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    const errorMessage =
        document.getElementById("loginError");


    /* Clear previous error */

    if (errorMessage) {

        errorMessage.textContent = "";

        errorMessage.style.display = "none";

    }


    /* Check empty fields */

    if (!userId || !password) {

        showLoginError(
            "Please enter User ID and Password."
        );

        return;

    }


    /* Convert ID to uppercase */

    const normalizedUserId =
        userId.toUpperCase();


    /* Find user */

    const user =
        AUTH_USERS[normalizedUserId];


    /* Invalid login */

    if (!user || user.password !== password) {

        showLoginError(
            "Invalid User ID or Password."
        );

        return;

    }


    /* ======================================================
       LOGIN SUCCESS
       ====================================================== */

    sessionStorage.setItem(
        "loggedIn",
        "true"
    );

    sessionStorage.setItem(
        "userId",
        normalizedUserId
    );

    sessionStorage.setItem(
        "userName",
        user.name
    );

    sessionStorage.setItem(
        "userRole",
        user.role
    );


    /* ======================================================
       GO TO DASHBOARD
       ====================================================== */

    window.location.href =
        "../dashboard/dashboard.html";

}


/* ==========================================================
   LOGIN ERROR
   ========================================================== */

function showLoginError(message) {

    const errorMessage =
        document.getElementById("loginError");

    if (!errorMessage) {

        alert(message);

        return;

    }


    errorMessage.textContent = message;

    errorMessage.style.display = "block";

}