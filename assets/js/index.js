// Variaveis
const addTaskBtn = document.querySelector('.add-task-btn');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const myModal = new bootstrap.Modal(document.getElementById('myModal'));
let isEditng = false;
let taskToEditId = null;
let tasksArr;

// Funções

window.addEventListener('load', async () => {
    await getTasks();
    renderTasks();
});

const showModal = () => {
    myModal.show();
}

const hideModal = () => {
    myModal.hide();
}

const getInputValue = () => {
    const title = document.querySelector('#inputTaskTitle').value;
    const category = document.querySelector('#inputCategory').value;
    const time = document.querySelector('#inputTime').value;
    return { title, category, time };
}

const createNewTask = () => {
    const inputValue = getInputValue();

    let task;

    try {
        task = new Task(inputValue.title, inputValue.category, inputValue.time);
    } catch (err) {
        console.error(err);
    }

    if (task) {
        sendData(task)
            .then(async () => {
                await getTasks()
            })
            .catch(err => console.error('Erro ao criar tarefa: ' + err))
    }

}

const getTasks = async () => {
    return getData()
        .then((response) => {
            tasksArr = response;
            renderTasks();
        })
        .catch(err => {
            console.error('Erro ao obter tarefa: ' + err)
            throw err;
        });
}

const renderTasks = () => {
    const noTask = document.querySelector('.no-task');
    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = '';
    if (tasksArr.length === 0) {
        noTask.classList.remove('d-none');
    } else {
        noTask.classList.add('d-none');

        const fragment = document.createDocumentFragment();

        tasksArr.forEach(task => {
            const taskSection = document.createElement('section');
            taskSection.className = 'row w-100 task-component my-3 mx-auto d-flex align-items-center';
            taskSection.innerHTML = `
                <div class="col-auto p-0">
                    <div class="check-box-container">
                        <label class="form-check-label custom-check-box">
                            <input class="form-check-input d-none" type="checkbox" ${task.completed ? 'checked' : ''} onclick="completeTask(this.checked, '${task._id}')"/>
                            <div class="checkmark"></div>
                        </label>
                    </div>
                </div>
                <div class="task-content col p-0">
                    <span class="task-title text-dark">${task.title}</span>
                    <span class="task-details">${task.category}<span class="dot">•</span>
                        <iconify-icon icon="ic:outline-watch-later"></iconify-icon>
                        ${task.time}</span>
                </div>
                <div class="col-auto btn-content">
                    <button class="edit-btn" onclick="editTask('${task._id}')">
                        <iconify-icon icon="solar:pen-bold"></iconify-icon>
                    </button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">
                        <iconify-icon icon="mdi:trash"></iconify-icon>
                    </button>
                </div>`;

            fragment.appendChild(taskSection);
        });

        tasksContainer.appendChild(fragment);
    }
}

const deleteTask = (id) => {
    deleteData(id)
        .then(async () => {
            await getTasks();
        })
        .catch((err) => {
            console.error("Erro ao excluir o tarefa:", err);
        });
}

const setFormData = (id) => {
    const task = tasksArr.find(task => task._id === id);
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
    const updatedTask = getInputValue();

     updateData(taskId, updatedTask)
        .then(async () => await getTasks())
        .catch(err => console.error('Erro ao atualizar tarefa: ' + err));
}

const completeTask = (checked, id) => {

    const task = {
        completed: checked
    }

    console.log(task);
    
}

const clearInput = () => {
    document.querySelector('#inputTaskTitle').value = '';
    document.querySelector('#inputCategory').value = '';
    document.querySelector('#inputTime').value = '';
}

// // Eventos
addTaskBtn.addEventListener('click', () => {
    showModal();
});

saveBtn.addEventListener('click', () => {
    if (isEditng) {
        updateTask(taskToEditId);
    } else {
        createNewTask();
    }
    hideModal();
    clearInput();
    isEditng = false;
});

cancelBtn.addEventListener('click', () => {
    hideModal();
    clearInput();
});