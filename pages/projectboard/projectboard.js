"use strict";

/* ==========================================================
   ONEPWS PMS — PROJECT BOARD JS
   ========================================================== */


/* ==========================================================
   LOGIN PROTECTION
   ========================================================== */

if (sessionStorage.getItem("loggedIn") !== "true") {

    window.location.href = "../auth/login.html";

}


/* ==========================================================
   PROJECT DATA
   ========================================================== */

const projects = [

    {
        projectNumber: "PMS-2026-0001",
        projectName: "Taj Hotel Mumbai",
        customer: "Taj Hotels",
        manager: "Ashu",
        status: "Running",
        statusClass: "running",
        progress: 72,
        startDate: "10 Jun 2026",
        endDate: "30 Sep 2026"
    },

    {
        projectNumber: "PMS-2026-0002",
        projectName: "AIIMS Delhi",
        customer: "AIIMS",
        manager: "Rahul",
        status: "Design",
        statusClass: "design",
        progress: 45,
        startDate: "15 Jun 2026",
        endDate: "15 Oct 2026"
    },

    {
        projectNumber: "PMS-2026-0003",
        projectName: "Infosys Bangalore",
        customer: "Infosys",
        manager: "Amit",
        status: "QC",
        statusClass: "qc",
        progress: 86,
        startDate: "01 May 2026",
        endDate: "20 Aug 2026"
    },

    {
        projectNumber: "PMS-2026-0004",
        projectName: "Corporate HQ",
        customer: "ABC Pvt Ltd",
        manager: "Neha",
        status: "Running",
        statusClass: "running",
        progress: 61,
        startDate: "20 Jun 2026",
        endDate: "30 Nov 2026"
    }

];


/* ==========================================================
   PAGE LOAD
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeProjectBoard
);


/* ==========================================================
   INITIALIZE
   ========================================================== */

function initializeProjectBoard() {

    renderProjects();

    initializeSearch();

    initializeFilters();

    initializeNewProject();

    initializeLogout();

    initializeNotifications();

}


/* ==========================================================
   PROJECT GRID
   ========================================================== */

function renderProjects(projectList = projects) {

    const projectGrid =
        document.getElementById("projectGrid");

    if (!projectGrid) {
        return;
    }


    projectGrid.innerHTML = "";


    if (projectList.length === 0) {

        projectGrid.innerHTML = `

            <div class="no-projects">

                <i class="fa-solid fa-folder-open"></i>

                <h3>No Projects Found</h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;

        return;
    }


    projectList.forEach(function(project) {

        const card =
            document.createElement("div");

        card.className = "project-card";


        card.innerHTML = `

            <div class="project-card-top">

                <span class="project-status ${project.statusClass}">
                    ${project.status}
                </span>

                <button
                    class="card-menu"
                    title="Project Options">

                    <i class="fa-solid fa-ellipsis"></i>

                </button>

            </div>


            <h2>
                ${project.projectName}
            </h2>


            <p class="project-number">
                ${project.projectNumber}
            </p>


            <div class="project-details">

                <div>

                    <i class="fa-solid fa-building"></i>

                    <span>
                        ${project.customer}
                    </span>

                </div>


                <div>

                    <i class="fa-solid fa-user"></i>

                    <span>
                        ${project.manager}
                    </span>

                </div>


                <div>

                    <i class="fa-regular fa-calendar"></i>

                    <span>
                        ${project.startDate}
                        -
                        ${project.endDate}
                    </span>

                </div>

            </div>


            <div class="project-progress-info">

                <span>
                    Project Progress
                </span>

                <strong>
                    ${project.progress}%
                </strong>

            </div>


            <div class="project-progress">

                <div
                    class="project-progress-fill"
                    style="width:${project.progress}%">
                </div>

            </div>


            <button
                class="open-project"
                data-project="${project.projectNumber}">

                Open Project

                <i class="fa-solid fa-arrow-right"></i>

            </button>

        `;


        projectGrid.appendChild(card);

    });


    initializeProjectButtons();

}


/* ==========================================================
   OPEN PROJECT
   ========================================================== */

function initializeProjectButtons() {

    const buttons =
        document.querySelectorAll(".open-project");


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const projectNumber =
                    this.dataset.project;


                sessionStorage.setItem(
                    "selectedProject",
                    projectNumber
                );


                window.location.href =
                    "../projectdashboard/projectdashboard.html";

            }
        );

    });

}


/* ==========================================================
   SEARCH
   ========================================================== */

function initializeSearch() {

    const searchInput =
        document.getElementById("searchProject");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );

}


/* ==========================================================
   FILTERS
   ========================================================== */

function initializeFilters() {

    const filters =
        document.querySelectorAll(
            ".filter-panel select"
        );


    filters.forEach(function(filter) {

        filter.addEventListener(
            "change",
            function() {

                applyFilters();

            }
        );

    });

}


/* ==========================================================
   APPLY SEARCH + FILTERS
   ========================================================== */

function applyFilters() {

    const searchInput =
        document.getElementById("searchProject");


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    let filteredProjects =
        projects.filter(function(project) {

            const searchableText = `

                ${project.projectName}
                ${project.projectNumber}
                ${project.customer}
                ${project.manager}
                ${project.status}

            `.toLowerCase();


            return searchableText.includes(
                searchText
            );

        });


    renderProjects(filteredProjects);

}


/* ==========================================================
   NEW PROJECT
   ========================================================== */

function initializeNewProject() {

    const newProject =
        document.getElementById("newProject");


    if (!newProject) {
        return;
    }


    newProject.addEventListener(
        "click",
        function() {

            window.location.href =
                "../projectwizard/projectwizard.html";

        }
    );

}


/* ==========================================================
   LOGOUT
   ========================================================== */

function initializeLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            sessionStorage.clear();


            window.location.href =
                "../auth/login.html";

        }
    );

}


/* ==========================================================
   NOTIFICATION
   ========================================================== */

function initializeNotifications() {

    const notificationBtn =
        document.getElementById("notificationBtn");


    if (!notificationBtn) {
        return;
    }


    notificationBtn.addEventListener(
        "click",
        function() {

            alert(
                "You have no new notifications."
            );

        }
    );

}