/* ==========================================================
   ONEPWS ENTERPRISE PROJECT MANAGEMENT SYSTEM
   TASK BOARD JAVASCRIPT
========================================================== */


/* ==========================================================
   SAMPLE TASK DATA
========================================================== */

let tasks = [

    {
        id: 1,

        projectNo: "PMS-2026-001",

        project: "Corporate Headquarters",

        customer: "ABC Pvt Ltd",

        businessUnit: "Corporate",

        module: "Ceiling Module",

        priority: "High",

        assignedTo: "Ashu",

        status: "RFQ",

        startDate: "2026-08-01",

        endDate: "2026-08-15",

        description: "Prepare RFQ and technical requirements for ceiling materials."
    },

    {
        id: 2,

        projectNo: "PMS-2026-002",

        project: "Corporate Headquarters",

        customer: "ABC Pvt Ltd",

        businessUnit: "Corporate",

        module: "Paneling Module",

        priority: "Medium",

        assignedTo: "Rahul",

        status: "RFQ",

        startDate: "2026-08-02",

        endDate: "2026-08-22",

        description: "Collect quotations from approved vendors."
    },

    {
        id: 3,

        projectNo: "PMS-2026-003",

        project: "Retail Experience Center",

        customer: "XYZ Industries",

        businessUnit: "Retail",

        module: "Furniture Module",

        priority: "High",

        assignedTo: "Amit",

        status: "INFO MISSING",

        startDate: "2026-08-01",

        endDate: "2026-08-10",

        description: "Customer layout approval is pending."
    },

    {
        id: 4,

        projectNo: "PMS-2026-004",

        project: "Corporate Headquarters",

        customer: "ABC Pvt Ltd",

        businessUnit: "Corporate",

        module: "Electrical Module",

        priority: "High",

        assignedTo: "Ashu",

        status: "WIP",

        startDate: "2026-08-01",

        endDate: "2026-08-30",

        description: "Electrical design and execution work in progress."
    },

    {
        id: 5,

        projectNo: "PMS-2026-005",

        project: "Hospital Expansion",

        customer: "DEF Corporation",

        businessUnit: "Healthcare",

        module: "Flooring Module",

        priority: "High",

        assignedTo: "Rohit",

        status: "WIP",

        startDate: "2026-08-02",

        endDate: "2026-08-18",

        description: "Flooring installation is under execution."
    },

    {
        id: 6,

        projectNo: "PMS-2026-006",

        project: "Corporate Headquarters",

        customer: "ABC Pvt Ltd",

        businessUnit: "Corporate",

        module: "Partition Module",

        priority: "Medium",

        assignedTo: "Vikas",

        status: "QC",

        startDate: "2026-08-01",

        endDate: "2026-08-14",

        description: "Quality inspection and snag verification."
    },

    {
        id: 7,

        projectNo: "PMS-2026-007",

        project: "Hotel Renovation",

        customer: "XYZ Industries",

        businessUnit: "Hospitality",

        module: "Door Module",

        priority: "Low",

        assignedTo: "Rahul",

        status: "RESOLVED",

        startDate: "2026-07-20",

        endDate: "2026-08-08",

        description: "Door hardware issue resolved."
    },

    {
        id: 8,

        projectNo: "PMS-2026-008",

        project: "Retail Experience Center",

        customer: "XYZ Industries",

        businessUnit: "Retail",

        module: "Lighting Module",

        priority: "Medium",

        assignedTo: "Amit",

        status: "COMPLETED",

        startDate: "2026-07-10",

        endDate: "2026-07-30",

        description: "Lighting installation completed."
    }

];


/* ==========================================================
   DOM REFERENCES
========================================================== */

const columns = {

    "RFQ": document.getElementById("rfqCards"),

    "INFO MISSING": document.getElementById("infoCards"),

    "WIP": document.getElementById("wipCards"),

    "QC": document.getElementById("qcCards"),

    "RESOLVED": document.getElementById("resolvedCards"),

    "COMPLETED": document.getElementById("completedCards")

};


const searchTask = document.getElementById("searchTask");

const priorityFilter = document.getElementById("priorityFilter");

const customerFilter = document.getElementById("customerFilter");

const memberFilter = document.getElementById("memberFilter");

const sortTasks = document.getElementById("sortTasks");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskModal = document.getElementById("taskModal");

const closeModal = document.getElementById("closeModal");

const cancelModal = document.getElementById("cancelModal");

const saveTask = document.getElementById("saveTask");

const deleteTask = document.getElementById("deleteTask");


let selectedTaskId = null;


/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", function(){

    populateFilters();

    renderTasks();

    initializeEvents();

});


/* ==========================================================
   POPULATE FILTERS
========================================================== */

function populateFilters(){

    const customers = [...new Set(tasks.map(task => task.customer))];

    const members = [...new Set(tasks.map(task => task.assignedTo))];


    customers.forEach(customer => {

        const option = document.createElement("option");

        option.value = customer;

        option.textContent = customer;

        customerFilter.appendChild(option);

    });


    members.forEach(member => {

        const option = document.createElement("option");

        option.value = member;

        option.textContent = member;

        memberFilter.appendChild(option);

    });

}


/* ==========================================================
   RENDER TASKS
========================================================== */

function renderTasks(){

    Object.values(columns).forEach(column => {

        column.innerHTML = "";

    });


    let filteredTasks = [...tasks];


    const searchValue = searchTask.value.toLowerCase();


    if(searchValue){

        filteredTasks = filteredTasks.filter(task =>

            task.project.toLowerCase().includes(searchValue) ||

            task.customer.toLowerCase().includes(searchValue) ||

            task.module.toLowerCase().includes(searchValue)

        );

    }


    if(priorityFilter.value){

        filteredTasks = filteredTasks.filter(task =>

            task.priority === priorityFilter.value

        );

    }


    if(customerFilter.value){

        filteredTasks = filteredTasks.filter(task =>

            task.customer === customerFilter.value

        );

    }


    if(memberFilter.value){

        filteredTasks = filteredTasks.filter(task =>

            task.assignedTo === memberFilter.value

        );

    }


    filteredTasks = sortTaskData(filteredTasks);


    filteredTasks.forEach(task => {

        const card = createTaskCard(task);

        if(columns[task.status]){

            columns[task.status].appendChild(card);

        }

    });


    updateCounts();

    updateKPIs();

}


/* ==========================================================
   SORT TASKS
========================================================== */

function sortTaskData(taskData){

    const sortValue = sortTasks.value;


    if(sortValue === "priority"){

        const priorityOrder = {

            High: 1,

            Medium: 2,

            Low: 3

        };


        taskData.sort((a,b) =>

            priorityOrder[a.priority] -

            priorityOrder[b.priority]

        );

    }


    else if(sortValue === "project"){

        taskData.sort((a,b) =>

            a.project.localeCompare(b.project)

        );

    }


    else{

        taskData.sort((a,b) =>

            new Date(a.endDate) -

            new Date(b.endDate)

        );

    }


    return taskData;

}


/* ==========================================================
   CREATE TASK CARD
========================================================== */

function createTaskCard(task){

    const card = document.createElement("div");

    card.className = "task-card";

    card.draggable = true;

    card.dataset.id = task.id;


    const remaining = getTimeRemaining(task.endDate);

    const priorityClass = task.priority.toLowerCase();


    card.innerHTML = `

        <div class="task-card-header">

            <div class="task-project">

                ${task.project}

            </div>

            <button class="task-menu">

                <i class="fa-solid fa-ellipsis"></i>

            </button>

        </div>


        <div class="task-module">

            <i class="fa-solid fa-cube"></i>

            ${task.module}

        </div>


        <div class="task-meta">

            <div class="task-meta-item">

                <span>Project</span>

                <strong>${task.projectNo}</strong>

            </div>

            <div class="task-meta-item">

                <span>Due Date</span>

                <strong>${formatDate(task.endDate)}</strong>

            </div>

        </div>


        <div class="task-footer">

            <div class="assignee">

                <div class="assignee-avatar">

                    ${getInitials(task.assignedTo)}

                </div>

                ${task.assignedTo}

            </div>


            <span class="priority ${priorityClass}">

                ${task.priority}

            </span>

        </div>


        <div class="time-left ${remaining.className}">

            <i class="fa-regular fa-clock"></i>

            ${remaining.text}

        </div>

    `;


    card.addEventListener("click", function(event){

        if(event.target.closest(".task-menu")) return;

        openTaskModal(task.id);

    });


    card.addEventListener("dragstart", function(){

        selectedTaskId = task.id;

        card.classList.add("dragging");

    });


    card.addEventListener("dragend", function(){

        card.classList.remove("dragging");

    });


    return card;

}


/* ==========================================================
   TIME REMAINING
========================================================== */

function getTimeRemaining(date){

    const today = new Date();

    today.setHours(0,0,0,0);


    const dueDate = new Date(date);

    dueDate.setHours(0,0,0,0);


    const difference = dueDate - today;

    const days = Math.ceil(

        difference / (1000 * 60 * 60 * 24)

    );


    if(days < 0){

        return {

            text: `${Math.abs(days)} Days Overdue`,

            className: "danger"

        };

    }


    if(days === 0){

        return {

            text: "Due Today",

            className: "danger"

        };

    }


    if(days <= 3){

        return {

            text: `${days} Days Remaining`,

            className: "warning"

        };

    }


    return {

        text: `${days} Days Remaining`,

        className: "normal"

    };

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate(date){

    if(!date) return "-";


    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}


/* ==========================================================
   GET INITIALS
========================================================== */

function getInitials(name){

    if(!name) return "?";


    return name

        .split(" ")

        .map(word => word[0])

        .join("")

        .substring(0,2)

        .toUpperCase();

}


/* ==========================================================
   UPDATE COUNTS
========================================================== */

function updateCounts(){

    document.getElementById("count-rfq").textContent =

        tasks.filter(task => task.status === "RFQ").length;


    document.getElementById("count-info").textContent =

        tasks.filter(task => task.status === "INFO MISSING").length;


    document.getElementById("count-wip").textContent =

        tasks.filter(task => task.status === "WIP").length;


    document.getElementById("count-qc").textContent =

        tasks.filter(task => task.status === "QC").length;


    document.getElementById("count-resolved").textContent =

        tasks.filter(task => task.status === "RESOLVED").length;


    document.getElementById("count-completed").textContent =

        tasks.filter(task => task.status === "COMPLETED").length;

}


/* ==========================================================
   UPDATE KPI
========================================================== */

function updateKPIs(){

    const totalProjects =

        new Set(tasks.map(task => task.project)).size;


    const activeTasks = tasks.filter(task =>

        task.status !== "COMPLETED"

    ).length;


    const completedTasks = tasks.filter(task =>

        task.status === "COMPLETED"

    ).length;


    const today = new Date();

    today.setHours(0,0,0,0);


    const overdueTasks = tasks.filter(task => {

        if(task.status === "COMPLETED") return false;

        const due = new Date(task.endDate);

        due.setHours(0,0,0,0);

        return due < today;

    }).length;


    const todayTasks = tasks.filter(task => {

        const due = new Date(task.endDate);

        due.setHours(0,0,0,0);

        return due.getTime() === today.getTime();

    }).length;


    document.getElementById("totalProjects").textContent = totalProjects;

    document.getElementById("activeTasks").textContent = activeTasks;

    document.getElementById("overdueTasks").textContent = overdueTasks;

    document.getElementById("completedTasks").textContent = completedTasks;

    document.getElementById("todayTasks").textContent = todayTasks;

}


/* ==========================================================
   DRAG AND DROP
========================================================== */

document.querySelectorAll(".card-container").forEach(container => {

    container.addEventListener("dragover", function(event){

        event.preventDefault();

        container.classList.add("drag-over");

    });


    container.addEventListener("dragleave", function(){

        container.classList.remove("drag-over");

    });


    container.addEventListener("drop", function(event){

        event.preventDefault();

        container.classList.remove("drag-over");


        if(!selectedTaskId) return;


        const task = tasks.find(

            task => task.id === selectedTaskId

        );


        if(task){

            task.status = container.dataset.column;

            showToast(

                `Task moved to ${task.status}`

            );

            renderTasks();

        }


        selectedTaskId = null;

    });

});


/* ==========================================================
   OPEN TASK MODAL
========================================================== */

function openTaskModal(id){

    const task = tasks.find(

        task => task.id === id

    );


    if(!task) return;


    selectedTaskId = id;


    document.getElementById("modalTaskTitle").textContent =

        task.module;


    document.getElementById("modalProjectNumber").textContent =

        task.projectNo;


    document.getElementById("projectNo").value = task.projectNo;

    document.getElementById("projectName").value = task.project;

    document.getElementById("customer").value = task.customer;

    document.getElementById("businessUnit").value = task.businessUnit;

    document.getElementById("moduleName").value = task.module;

    document.getElementById("priority").value = task.priority;

    document.getElementById("assignedTo").value = task.assignedTo;

    document.getElementById("status").value = task.status;

    document.getElementById("startDate").value = task.startDate;

    document.getElementById("endDate").value = task.endDate;

    document.getElementById("description").value = task.description;


    taskModal.classList.add("show");

}


/* ==========================================================
   CLOSE MODAL
========================================================== */

function closeTaskModal(){

    taskModal.classList.remove("show");

    selectedTaskId = null;

}


/* ==========================================================
   SAVE TASK
========================================================== */

function saveCurrentTask(){

    if(!selectedTaskId) return;


    const task = tasks.find(

        task => task.id === selectedTaskId

    );


    if(!task) return;


    task.projectNo = document.getElementById("projectNo").value;

    task.project = document.getElementById("projectName").value;

    task.customer = document.getElementById("customer").value;

    task.businessUnit = document.getElementById("businessUnit").value;

    task.module = document.getElementById("moduleName").value;

    task.priority = document.getElementById("priority").value;

    task.assignedTo = document.getElementById("assignedTo").value;

    task.status = document.getElementById("status").value;

    task.startDate = document.getElementById("startDate").value;

    task.endDate = document.getElementById("endDate").value;

    task.description = document.getElementById("description").value;


    renderTasks();

    closeTaskModal();

    showToast("Task updated successfully");

}


/* ==========================================================
   DELETE TASK
========================================================== */

function deleteCurrentTask(){

    if(!selectedTaskId) return;


    const confirmed = confirm(

        "Are you sure you want to delete this task?"

    );


    if(!confirmed) return;


    tasks = tasks.filter(

        task => task.id !== selectedTaskId

    );


    renderTasks();

    closeTaskModal();

    showToast("Task deleted");

}


/* ==========================================================
   NEW TASK
========================================================== */

function createNewTask(){

    selectedTaskId = null;


    document.getElementById("modalTaskTitle").textContent =

        "Create New Task";


    document.getElementById("modalProjectNumber").textContent =

        "New Task";


    document.querySelectorAll(

        "#taskModal input"

    ).forEach(input => {

        input.value = "";

    });


    document.getElementById("description").value = "";

    document.getElementById("priority").value = "Medium";

    document.getElementById("status").value = "RFQ";


    taskModal.classList.add("show");


    saveTask.onclick = function(){

        const newTask = {

            id: Date.now(),

            projectNo:

                document.getElementById("projectNo").value ||

                `PMS-${Date.now()}`,


            project:

                document.getElementById("projectName").value ||

                "Untitled Project",


            customer:

                document.getElementById("customer").value,


            businessUnit:

                document.getElementById("businessUnit").value,


            module:

                document.getElementById("moduleName").value ||

                "New Module",


            priority:

                document.getElementById("priority").value,


            assignedTo:

                document.getElementById("assignedTo").value ||

                "Unassigned",


            status:

                document.getElementById("status").value,


            startDate:

                document.getElementById("startDate").value,


            endDate:

                document.getElementById("endDate").value,


            description:

                document.getElementById("description").value

        };


        tasks.push(newTask);

        renderTasks();

        closeTaskModal();

        showToast("New task created successfully");


        saveTask.onclick = saveCurrentTask;

    };

}


/* ==========================================================
   TABS
========================================================== */

document.querySelectorAll(".tab-btn").forEach(button => {

    button.addEventListener("click", function(){

        document.querySelectorAll(".tab-btn")

            .forEach(btn =>

                btn.classList.remove("active")

            );


        document.querySelectorAll(".tab-content")

            .forEach(content =>

                content.classList.remove("active")

            );


        button.classList.add("active");


        const tab = button.dataset.tab;


        document.getElementById(tab)

            .classList.add("active");

    });

});


/* ==========================================================
   EVENTS
========================================================== */

function initializeEvents(){

    searchTask.addEventListener(

        "input",

        renderTasks

    );


    priorityFilter.addEventListener(

        "change",

        renderTasks

    );


    customerFilter.addEventListener(

        "change",

        renderTasks

    );


    memberFilter.addEventListener(

        "change",

        renderTasks

    );


    sortTasks.addEventListener(

        "change",

        renderTasks

    );


    addTaskBtn.addEventListener(

        "click",

        createNewTask

    );


    closeModal.addEventListener(

        "click",

        closeTaskModal

    );


    cancelModal.addEventListener(

        "click",

        closeTaskModal

    );


    saveTask.addEventListener(

        "click",

        saveCurrentTask

    );


    deleteTask.addEventListener(

        "click",

        deleteCurrentTask

    );


    taskModal.addEventListener(

        "click",

        function(event){

            if(event.target === taskModal){

                closeTaskModal();

            }

        }

    );

}


/* ==========================================================
   TOAST
========================================================== */

function showToast(message){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;


    document

        .getElementById("toastContainer")

        .appendChild(toast);


    setTimeout(function(){

        toast.remove();

    },3000);

}


/* ==========================================================
   LIVE TIMER UPDATE
========================================================== */

setInterval(function(){

    renderTasks();

},60000);