/* =========================================================
   ONEPWS PMS
   PROJECT WIZARD
========================================================= */


/* =========================================================
   PROJECT DATA
========================================================= */

let currentStep = 1;
const totalSteps = 4;

let newProject = {

    template: "",
    projectNumber: "",
    projectName: "",
    customer: "",
    businessUnit: "",
    projectManager: "",
    designHead: "",
    priority: "Medium",
    startDate: "",
    endDate: "",
    description: "",
    modules: []

};


/* =========================================================
   TEMPLATE MODULES
========================================================= */

const templateModules = {

    Office: [
        "Ceiling",
        "Paneling",
        "Partition",
        "Flooring",
        "Door",
        "Window",
        "Electrical",
        "Furniture"
    ],

    Retail: [
        "Display",
        "Signage",
        "Ceiling",
        "Paneling",
        "Flooring",
        "Furniture",
        "Lighting",
        "Electrical"
    ],

    Hospital: [
        "Medical Gas",
        "HVAC",
        "Clean Room",
        "Ceiling",
        "Flooring",
        "Electrical",
        "Furniture"
    ],

    Hotel: [
        "Guest Rooms",
        "Lobby",
        "Restaurant",
        "Ceiling",
        "Paneling",
        "Flooring",
        "Furniture",
        "Lighting"
    ],

    Industrial: [
        "Structure",
        "Electrical",
        "Flooring",
        "Utility",
        "HVAC"
    ],

    Custom: [
        "Ceiling",
        "Paneling",
        "Partition",
        "Flooring",
        "Door",
        "Window",
        "Electrical",
        "Furniture",
        "HVAC",
        "Plumbing"
    ]

};


/* =========================================================
   GENERATE PROJECT NUMBER
========================================================= */

function generateProjectNumber() {

    const year = new Date().getFullYear();

    const randomNumber =
        Math.floor(Math.random() * 9000) + 1000;

    return "PMS-" + year + "-" + randomNumber;

}


/* =========================================================
   INITIALIZE WIZARD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    newProject.projectNumber =
        generateProjectNumber();

    const projectNumberInput =
        document.getElementById("projectNumber");

    if (projectNumberInput) {

        projectNumberInput.value =
            newProject.projectNumber;

    }


    initializeTemplates();

    showStep(1);


    document
        .getElementById("nextBtn")
        .addEventListener("click", nextStep);


    document
        .getElementById("prevBtn")
        .addEventListener("click", previousStep);


    document
        .getElementById("cancelBtn")
        .addEventListener("click", cancelProject);

});


/* =========================================================
   TEMPLATE SELECTION
========================================================= */

function initializeTemplates() {

    const templateButtons =
        document.querySelectorAll(".template-btn");


    templateButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            templateButtons.forEach(function (item) {

                item.classList.remove("selected");

            });


            button.classList.add("selected");


            newProject.template =
                button.dataset.template;


            newProject.modules =
                [...templateModules[newProject.template]];


        });

    });

}


/* =========================================================
   SHOW CURRENT STEP
========================================================= */

function showStep(stepNumber) {

    const allPages =
        document.querySelectorAll(".step-page");


    allPages.forEach(function (page) {

        page.classList.remove("active-page");

    });


    const activePage =
        document.getElementById("step" + stepNumber);


    if (activePage) {

        activePage.classList.add("active-page");

    }


    updateProgressBar();


    const prevButton =
        document.getElementById("prevBtn");

    const nextButton =
        document.getElementById("nextBtn");


    /* Previous Button */

    if (stepNumber === 1) {

        prevButton.style.display = "none";

    }

    else {

        prevButton.style.display = "inline-flex";

    }


    /* Next / Create Button */

    if (stepNumber === totalSteps) {

        nextButton.innerHTML =
            "Create Project ✓";

    }

    else {

        nextButton.innerHTML =
            "Next →";

    }

}


/* =========================================================
   UPDATE TOP PROGRESS STEPS
========================================================= */

function updateProgressBar() {

    const wizardSteps =
        document.querySelectorAll(".wizard-step");


    const lines =
        document.querySelectorAll(".line");


    wizardSteps.forEach(function (step, index) {

        step.classList.remove(
            "active",
            "completed"
        );


        const stepNumber = index + 1;


        if (stepNumber < currentStep) {

            step.classList.add("completed");

        }

        else if (stepNumber === currentStep) {

            step.classList.add("active");

        }

    });


    lines.forEach(function (line, index) {

        line.classList.remove("completed");


        if (index + 1 < currentStep) {

            line.classList.add("completed");

        }

    });

}


/* =========================================================
   NEXT STEP
========================================================= */

function nextStep() {

    /* STEP 1 */

    if (currentStep === 1) {

        if (!newProject.template) {

            alert(
                "Please select a Project Template first."
            );

            return;

        }

    }


    /* STEP 2 */

    if (currentStep === 2) {

        if (!saveProjectDetails()) {

            return;

        }

    }


    /* STEP 3 */

    if (currentStep === 3) {

        if (newProject.modules.length === 0) {

            alert(
                "Please select at least one module."
            );

            return;

        }

    }


    /* STEP 4 */

    if (currentStep === 4) {

        createProject();

        return;

    }


    currentStep++;

    
    /* Load modules when entering Step 3 */

    if (currentStep === 3) {

        loadModules();

    }


    /* Load review when entering Step 4 */

    if (currentStep === 4) {

        updateReview();

    }


    showStep(currentStep);

}


/* =========================================================
   PREVIOUS STEP
========================================================= */

function previousStep() {

    if (currentStep > 1) {

        currentStep--;

        showStep(currentStep);

    }

}


/* =========================================================
   SAVE PROJECT DETAILS
========================================================= */

function saveProjectDetails() {

    const projectName =
        document.getElementById("projectName").value.trim();

    const customer =
        document.getElementById("customer").value;

    const businessUnit =
        document.getElementById("businessUnit").value;

    const projectManager =
        document.getElementById("projectManager").value;

    const designHead =
        document.getElementById("designHead").value;

    const priority =
        document.getElementById("priority").value;

    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;

    const description =
        document.getElementById("description").value.trim();


    if (!projectName) {

        alert(
            "Please enter Project Name."
        );

        return false;

    }


    if (!customer) {

        alert(
            "Please select Customer."
        );

        return false;

    }


    if (!startDate) {

        alert(
            "Please select Start Date."
        );

        return false;

    }


    if (!endDate) {

        alert(
            "Please select Target Completion Date."
        );

        return false;

    }


    newProject.projectNumber =
        document.getElementById("projectNumber").value;


    newProject.projectName =
        projectName;

    newProject.customer =
        customer;

    newProject.businessUnit =
        businessUnit;

    newProject.projectManager =
        projectManager;

    newProject.designHead =
        designHead;

    newProject.priority =
        priority;

    newProject.startDate =
        startDate;

    newProject.endDate =
        endDate;

    newProject.description =
        description;


    return true;

}


/* =========================================================
   LOAD MODULES
========================================================= */

function loadModules() {

    const moduleContainer =
        document.getElementById("moduleContainer");


    if (!moduleContainer) {

        return;

    }


    moduleContainer.innerHTML = "";


    newProject.modules.forEach(function (
        moduleName
    ) {

        const moduleCard =
            document.createElement("div");


        moduleCard.className =
            "module-option selected";


        moduleCard.dataset.module =
            moduleName;


        moduleCard.innerHTML = `

            <div class="module-check">
                ✓
            </div>

            <div class="module-name">
                ${moduleName}
            </div>

        `;


        moduleCard.addEventListener(
            "click",
            function () {

                toggleModule(moduleCard);

            }
        );


        moduleContainer.appendChild(
            moduleCard
        );

    });

}


/* =========================================================
   TOGGLE MODULE
========================================================= */

function toggleModule(moduleCard) {

    const moduleName =
        moduleCard.dataset.module;


    if (
        newProject.modules.includes(moduleName)
    ) {

        newProject.modules =
            newProject.modules.filter(
                function (module) {

                    return module !== moduleName;

                }
            );


        moduleCard.classList.remove(
            "selected"
        );

        moduleCard.querySelector(
            ".module-check"
        ).innerHTML = "";

    }

    else {

        newProject.modules.push(
            moduleName
        );


        moduleCard.classList.add(
            "selected"
        );


        moduleCard.querySelector(
            ".module-check"
        ).innerHTML = "✓";

    }

}


/* =========================================================
   UPDATE REVIEW PAGE
========================================================= */

function updateReview() {

    document.getElementById(
        "reviewTemplate"
    ).textContent =
        newProject.template || "-";


    document.getElementById(
        "reviewProjectNumber"
    ).textContent =
        newProject.projectNumber || "-";


    document.getElementById(
        "reviewProjectName"
    ).textContent =
        newProject.projectName || "-";


    document.getElementById(
        "reviewCustomer"
    ).textContent =
        newProject.customer || "-";


    document.getElementById(
        "reviewBusinessUnit"
    ).textContent =
        newProject.businessUnit || "-";


    document.getElementById(
        "reviewProjectManager"
    ).textContent =
        newProject.projectManager || "-";


    document.getElementById(
        "reviewDesignHead"
    ).textContent =
        newProject.designHead || "-";


    document.getElementById(
        "reviewPriority"
    ).textContent =
        newProject.priority || "-";


    document.getElementById(
        "reviewStartDate"
    ).textContent =
        newProject.startDate || "-";


    document.getElementById(
        "reviewEndDate"
    ).textContent =
        newProject.endDate || "-";


    document.getElementById(
        "reviewDescription"
    ).textContent =
        newProject.description || "-";


    document.getElementById(
        "reviewModules"
    ).textContent =
        newProject.modules.length > 0
            ? newProject.modules.join(", ")
            : "-";

}


/* =========================================================
   CREATE PROJECT
========================================================= */

function createProject() {

    const projectToSave = {

        ...newProject,

        status: "Active",

        progress: 0

    };


    const savedProject =
        addProject(projectToSave);


    if (!savedProject) {

        alert(
            "Unable to create project. Project number may already exist."
        );

        return;

    }


    alert(
        "Project Created Successfully!"
    );


    window.location.href =
        "../projectboard/projectboard.html";

}


/* =========================================================
   CANCEL PROJECT
========================================================= */

function cancelProject() {

    const confirmation =
        confirm(
            "Are you sure you want to cancel this project?"
        );


    if (confirmation) {

        window.location.href =
            "../projectboard/projectboard.html";

    }

}