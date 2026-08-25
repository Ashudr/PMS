/* =========================================================
   ONEPWS PMS
   CENTRAL DATABASE SYSTEM

   File:
   assets/js/database.js

   This file manages:
   - Projects
   - Tasks
   - Settings
   - Current User
   - CRUD operations
========================================================= */


/* =========================================================
   DATABASE STORAGE KEYS
========================================================= */

const PMS_DATABASE = {

    projects: "onepwsProjects",

    tasks: "onepwsTasks",

    users: "onepwsUsers",

    settings: "onepwsSettings",

    currentUser: "onepwsCurrentUser"

};


/* =========================================================
   GENERIC FUNCTIONS
========================================================= */


/* READ DATA */

function getDatabaseData(key) {

    try {

        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : [];

    }

    catch (error) {

        console.error(
            "Database Read Error:",
            error
        );

        return [];

    }

}


/* SAVE DATA */

function saveDatabaseData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Database Save Error:",
            error
        );

        return false;

    }

}


/* =========================================================
   PROJECT DATABASE
========================================================= */


/* GET ALL PROJECTS */

function getProjects() {

    return getDatabaseData(
        PMS_DATABASE.projects
    );

}


/* SAVE ALL PROJECTS */

function saveProjects(projects) {

    return saveDatabaseData(
        PMS_DATABASE.projects,
        projects
    );

}


/* GET SINGLE PROJECT */

function getProjectByNumber(projectNumber) {

    const projects = getProjects();

    return projects.find(function (project) {

        return project.projectNumber === projectNumber;

    });

}


/* ADD PROJECT */

function addProject(projectData) {

    const projects = getProjects();


    /* Check Duplicate Project Number */

    const existingProject =
        projects.find(function (project) {

            return project.projectNumber ===
                   projectData.projectNumber;

        });


    if (existingProject) {

        console.warn(
            "Project already exists."
        );

        return false;

    }


    /* Default Project Values */

    const newProject = {

        id: generateUniqueId(),

        projectNumber:
            projectData.projectNumber || generateProjectNumber(),

        projectName:
            projectData.projectName || "Untitled Project",

        customer:
            projectData.customer || "",

        businessUnit:
            projectData.businessUnit || "",

        projectManager:
            projectData.projectManager || "",

        designHead:
            projectData.designHead || "",

        priority:
            projectData.priority || "Medium",

        startDate:
            projectData.startDate || "",

        endDate:
            projectData.endDate || "",

        description:
            projectData.description || "",

        modules:
            projectData.modules || [],

        status:
            projectData.status || "Active",

        progress:
            projectData.progress || 0,

        createdDate:
            projectData.createdDate ||
            new Date().toISOString(),

        updatedDate:
            new Date().toISOString()

    };


    projects.push(newProject);

    saveProjects(projects);

    return newProject;

}


/* UPDATE PROJECT */

function updateProject(projectNumber, updatedData) {

    const projects = getProjects();


    const projectIndex =
        projects.findIndex(function (project) {

            return project.projectNumber === projectNumber;

        });


    if (projectIndex === -1) {

        console.warn(
            "Project not found."
        );

        return false;

    }


    projects[projectIndex] = {

        ...projects[projectIndex],

        ...updatedData,

        updatedDate:
            new Date().toISOString()

    };


    saveProjects(projects);

    return projects[projectIndex];

}


/* DELETE PROJECT */

function deleteProject(projectNumber) {

    const projects = getProjects();


    const updatedProjects =
        projects.filter(function (project) {

            return project.projectNumber !== projectNumber;

        });


    saveProjects(updatedProjects);


    /* Also delete related tasks */

    const tasks = getTasks();


    const updatedTasks =
        tasks.filter(function (task) {

            return task.projectNumber !== projectNumber;

        });


    saveTasks(updatedTasks);

    return true;

}


/* =========================================================
   PROJECT NUMBER GENERATOR
========================================================= */

function generateProjectNumber() {

    const year =
        new Date().getFullYear();


    const projects =
        getProjects();


    let highestNumber = 0;


    projects.forEach(function (project) {

        if (!project.projectNumber) {

            return;

        }


        const numberParts =
            project.projectNumber.split("-");


        const lastPart =
            numberParts[numberParts.length - 1];


        const projectNumber =
            parseInt(lastPart);


        if (
            !isNaN(projectNumber) &&
            projectNumber > highestNumber
        ) {

            highestNumber = projectNumber;

        }

    });


    const nextNumber =
        String(highestNumber + 1)
            .padStart(4, "0");


    return "PMS-" +
           year +
           "-" +
           nextNumber;

}


/* =========================================================
   TASK DATABASE
========================================================= */


/* GET ALL TASKS */

function getTasks() {

    return getDatabaseData(
        PMS_DATABASE.tasks
    );

}


/* SAVE ALL TASKS */

function saveTasks(tasks) {

    return saveDatabaseData(
        PMS_DATABASE.tasks,
        tasks
    );

}


/* GET TASK */

function getTaskById(taskId) {

    const tasks = getTasks();


    return tasks.find(function (task) {

        return task.id === taskId;

    });

}


/* ADD TASK */

function addTask(taskData) {

    const tasks = getTasks();


    const newTask = {

        id: generateUniqueId(),

        projectNumber:
            taskData.projectNumber || "",

        projectName:
            taskData.projectName || "",

        module:
            taskData.module || "",

        title:
            taskData.title || "New Task",

        description:
            taskData.description || "",

        assignedMember:
            taskData.assignedMember || "",

        priority:
            taskData.priority || "Medium",

        lane:
            taskData.lane || "RFQ",

        startDate:
            taskData.startDate || "",

        dueDate:
            taskData.dueDate || "",

        progress:
            taskData.progress || 0,

        status:
            taskData.status || "Active",

        createdDate:
            new Date().toISOString(),

        updatedDate:
            new Date().toISOString(),

        history: []

    };


    newTask.history.push({

        action:
            "Task Created",

        date:
            new Date().toISOString()

    });


    tasks.push(newTask);

    saveTasks(tasks);

    return newTask;

}


/* UPDATE TASK */

function updateTask(taskId, updatedData) {

    const tasks = getTasks();


    const taskIndex =
        tasks.findIndex(function (task) {

            return task.id === taskId;

        });


    if (taskIndex === -1) {

        return false;

    }


    tasks[taskIndex] = {

        ...tasks[taskIndex],

        ...updatedData,

        updatedDate:
            new Date().toISOString()

    };


    saveTasks(tasks);

    return tasks[taskIndex];

}


/* MOVE TASK */

function moveTask(taskId, newLane) {

    const tasks = getTasks();


    const taskIndex =
        tasks.findIndex(function (task) {

            return task.id === taskId;

        });


    if (taskIndex === -1) {

        return false;

    }


    const oldLane =
        tasks[taskIndex].lane;


    tasks[taskIndex].lane =
        newLane;


    tasks[taskIndex].updatedDate =
        new Date().toISOString();


    if (!tasks[taskIndex].history) {

        tasks[taskIndex].history = [];

    }


    tasks[taskIndex].history.push({

        action:
            "Moved from " +
            oldLane +
            " to " +
            newLane,

        date:
            new Date().toISOString()

    });


    saveTasks(tasks);

    return tasks[taskIndex];

}


/* DELETE TASK */

function deleteTask(taskId) {

    const tasks = getTasks();


    const updatedTasks =
        tasks.filter(function (task) {

            return task.id !== taskId;

        });


    saveTasks(updatedTasks);

    return true;

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    try {

        const user =
            localStorage.getItem(
                PMS_DATABASE.currentUser
            );

        return user ?
            JSON.parse(user) :
            null;

    }

    catch (error) {

        return null;

    }

}


function setCurrentUser(userData) {

    localStorage.setItem(

        PMS_DATABASE.currentUser,

        JSON.stringify(userData)

    );

}


function removeCurrentUser() {

    localStorage.removeItem(
        PMS_DATABASE.currentUser
    );

}


/* =========================================================
   USER DATABASE
========================================================= */

function getUsers() {

    return getDatabaseData(
        PMS_DATABASE.users
    );

}


function saveUsers(users) {

    return saveDatabaseData(
        PMS_DATABASE.users,
        users
    );

}


/* =========================================================
   SETTINGS DATABASE
========================================================= */

function getSettings() {

    try {

        const settings =
            localStorage.getItem(
                PMS_DATABASE.settings
            );


        return settings ?

            JSON.parse(settings)

            :

            {

                companyName:
                    "ONEPWS",

                theme:
                    "light",

                defaultProjectStatus:
                    "Active"

            };

    }

    catch (error) {

        return {};

    }

}


function saveSettings(settings) {

    localStorage.setItem(

        PMS_DATABASE.settings,

        JSON.stringify(settings)

    );

}


/* =========================================================
   UNIQUE ID GENERATOR
========================================================= */

function generateUniqueId() {

    return (

        Date.now().toString(36)

        +

        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


/* =========================================================
   PROJECT STATISTICS
========================================================= */

function getProjectStatistics() {

    const projects =
        getProjects();


    const totalProjects =
        projects.length;


    const activeProjects =
        projects.filter(function (project) {

            return project.status === "Active";

        }).length;


    const completedProjects =
        projects.filter(function (project) {

            return project.status === "Completed";

        }).length;


    const onHoldProjects =
        projects.filter(function (project) {

            return project.status === "On Hold";

        }).length;


    const criticalProjects =
        projects.filter(function (project) {

            return project.priority === "Critical";

        }).length;


    return {

        total: totalProjects,

        active: activeProjects,

        completed: completedProjects,

        onHold: onHoldProjects,

        critical: criticalProjects

    };

}


/* =========================================================
   TASK STATISTICS
========================================================= */

function getTaskStatistics() {

    const tasks =
        getTasks();


    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(function (task) {

            return task.lane === "COMPLETED" ||
                   task.status === "Completed";

        }).length;


    const overdueTasks =
        tasks.filter(function (task) {

            if (!task.dueDate) {

                return false;

            }


            const today =
                new Date();


            const dueDate =
                new Date(task.dueDate);


            return (

                dueDate < today

                &&

                task.lane !== "COMPLETED"

            );

        }).length;


    return {

        total: totalTasks,

        completed: completedTasks,

        overdue: overdueTasks,

        active:
            totalTasks - completedTasks

    };

}


/* =========================================================
   FIRST TIME DATABASE INITIALIZATION
========================================================= */

function initializeDatabase() {

    /* PROJECTS */

    if (

        !localStorage.getItem(
            PMS_DATABASE.projects
        )

    ) {

        localStorage.setItem(

            PMS_DATABASE.projects,

            JSON.stringify([])

        );

    }


    /* TASKS */

    if (

        !localStorage.getItem(
            PMS_DATABASE.tasks
        )

    ) {

        localStorage.setItem(

            PMS_DATABASE.tasks,

            JSON.stringify([])

        );

    }


    /* USERS */

    if (

        !localStorage.getItem(
            PMS_DATABASE.users
        )

    ) {

        const defaultUsers = [

            {

                id: "admin-001",

                username: "ONEPWS",

                name: "Master Administrator",

                role: "Master Admin",

                active: true

            }

        ];


        localStorage.setItem(

            PMS_DATABASE.users,

            JSON.stringify(defaultUsers)

        );

    }


    /* SETTINGS */

    if (

        !localStorage.getItem(
            PMS_DATABASE.settings
        )

    ) {

        const defaultSettings = {

            companyName:
                "ONEPWS",

            theme:
                "light",

            defaultProjectStatus:
                "Active"

        };


        localStorage.setItem(

            PMS_DATABASE.settings,

            JSON.stringify(defaultSettings)

        );

    }

}


/* =========================================================
   INITIALIZE DATABASE
========================================================= */

initializeDatabase();


/* =========================================================
   DATABASE READY
========================================================= */

console.log(
    "ONEPWS PMS Database Ready"
);