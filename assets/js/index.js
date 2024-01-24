// Variaveis
const addTaskBtn = document.querySelector('.add-task-btn');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const myModal = new bootstrap.Modal(document.getElementById('myModal'));
const toDoList = new ToDoList();
let isEditng = false;
let taskToEditId = null;

// Funções
const showModal = () => {
    myModal.show();
}

const hideModal = () => {
    myModal.hide();
}

const getInputValue = () => {
    const taskTitle = document.querySelector('#inputTaskTitle').value;
    const taskCategory = document.querySelector('#inputCategory').value;
    const taskTime = document.querySelector('#inputTime').value;
    return {taskTitle, taskCategory, taskTime};
}

const createNewTask = () => {
    const inputValue = getInputValue();

    let task;

    try {
        task = new Task(inputValue.taskTitle, inputValue.taskCategory, inputValue.taskTime);
        toDoList.addTask(task);
        completeTask(task.completed, task.id)
    } catch (err) {
        console.error(err);
    }

}

const renderTasks = () => {
    const noTask = document.querySelector('.no-task');
    const tasksContainer = document.querySelector('.tasks-container');
    const tasks = getTasks();
    tasksContainer.innerHTML = '';
    tasks.length === 0 ? noTask.classList.remove('d-none') : noTask.classList.add('d-none');
    tasks.forEach(task => {
        tasksContainer.innerHTML += `
        <section class="row w-100 task-component my-3 mx-auto d-flex align-items-center">
            <div class="col-auto p-0">
            <div class="check-box-container">
                <label class="form-check-label custom-check-box">
                <input class="form-check-input d-none" type="checkbox" ${task.completed ? 'checked' : ''} onclick="completeTask(this.checked, ${task.id})"/>
                <div class="checkmark"></div>
                </label>
            </div>
            </div>
            <div class="task-content col p-0">
            <span class="task-title text-dark">${task.title}</span>
            <span class="task-details"
                >${task.category}<span class="dot">•</span>
                <iconify-icon icon="ic:outline-watch-later"></iconify-icon>
                ${task.time}</span
            >
            </div>
            <div class="col-auto btn-content">
            <button class="edit-btn" onclick="editTask(${task.id})">
            <iconify-icon icon="solar:pen-bold"></iconify-icon>
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <iconify-icon icon="mdi:trash"></iconify-icon>
            </button>
            </div>
        </section>`
    })
}

const setFormData = (id) => {
    const tasks = getTasks();
    const task = tasks.find(item => item.id === id);

    if (task) {
        document.querySelector('#inputTaskTitle').value = task.title;
        document.querySelector('#inputCategory').value = task.category;
        document.querySelector('#inputTime').value = task.time;
    }
}


const editTask = (id) => {
    isEditng = true;
    setFormData(id);
    taskToEditId = id;
    showModal();
}

const updateTask = (taskId) => {
    const inputValue = getInputValue();
    toDoList.updateTask(taskId, inputValue.taskTitle, inputValue.taskCategory, inputValue.taskTime);
}

const deleteTask = (id) => {
    toDoList.deleteTask(id);
    renderTasks();
}

const completeTask = (checked, id) => {
    toDoList.completeTask(checked, id);
    console.log(checked);
    renderTasks();
}

const clearInput = () => {
    document.querySelector('#inputTaskTitle').value = '';
    document.querySelector('#inputCategory').value = '';
    document.querySelector('#inputTime').value = '';
}

// Eventos
addTaskBtn.addEventListener('click', () => {
    showModal();
});

saveBtn.addEventListener('click', () => {
    if (isEditng) {
        updateTask(taskToEditId);
    } else {
        createNewTask();
    }
    renderTasks();
    hideModal();
    clearInput();
    isEditng = false;
});

cancelBtn.addEventListener('click', () => {
    hideModal();
    clearInput();
});