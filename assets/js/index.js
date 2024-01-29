// Variaveis
const addTaskBtn = document.querySelector('.add-task-btn');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const myModal = new bootstrap.Modal(document.getElementById('myModal'));
let isEditng = false;
let taskToEditId = null;
let tasksArr;

// Funções
// Exibir modal
const showModal = () => {
    myModal.show();
}

// Esconder modal
const hideModal = () => {
    myModal.hide();
}

// Pegar texto dos Inputs
const getInputValue = () => {
    const title = document.querySelector('#inputTaskTitle').value;
    const category = document.querySelector('#inputCategory').value;
    const time = document.querySelector('#inputTime').value;
    return { title, category, time };
}

// Criar nova tarefa instanciando a classe e fazendo o POST
const createNewTask = () => {
    const inputValue = getInputValue();

    let task;

    try {
        task = new Task(inputValue.title, inputValue.category, inputValue.time);
    } catch (err) {
        throw err
    }

    if (task) {
        sendData(task)
            .then(async () => {
                await getTasks()
            })
            .catch(err => console.error('Erro ao criar tarefa: ' + err))
    }

}

// Obtem as tarefas do back-end
const getTasks = async () => {
    return getData()
        .then((response) => {
            tasksArr = response;
            renderTasks();
        })
        .catch(err => {
            console.error('Erro ao obter tarefa: ' + err)
        });
}

// Renderiza as tarefas na tela
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
                    <span class="task-details">${task.category}${task.time ? '<span class="dot">•</span> <iconify-icon icon="ic:outline-watch-later"></iconify-icon>' : ''}
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

// Deleta uma tarfa 
const deleteTask = (id) => {
    deleteData(id)
        .then(async () => {
            await getTasks();
        })
        .catch((err) => {
            console.error("Erro ao excluir o tarefa:", err);
        });
}

// Preenche os campos do modal quando estiver no modo de edição de tarefas
const setFormData = (id) => {
    const task = tasksArr.find(task => task._id === id);
    if (task) {
        document.querySelector('#inputTaskTitle').value = task.title;
        document.querySelector('#inputCategory').value = task.category;
        document.querySelector('#inputTime').value = task.time;
    }
}

// Entra em modo de edição de tarefas
const editTask = (id) => {
    isEditng = true;
    setFormData(id);
    taskToEditId = id;
    showModal();
}

// Atualiza uma tarefa
const updateTask = (taskId) => {
    const updatedTask = getInputValue();
    const existingTask = tasksArr.find(task => task._id === taskId);

    if (existingTask) {
        try {
            Task.validateField(updatedTask.title, 'Título');
            Task.validateField(updatedTask.category, 'Categoria');
            Task.validateTime(updatedTask.time);

            const editTaskCompleted = existingTask.completed;
            updatedTask.completed = editTaskCompleted;

            updateData(taskId, updatedTask)
                .then(async () => await getTasks())
                .catch(err => console.log('Erro ao atualizar tarefa: ' + err));
        } catch (err) {
            throw err
        }
    }
}

// Marca uma tarefa como concluida
// Enfrentando Erro de CORS quando marca como concluida
const completeTask = (checked, id) => {
    const task = tasksArr.find(item => item._id === id)
    if (task) {
        task.completed = checked;
        updateData(id, task)
            .then(async () => await getTasks())
            .catch(err => console.error('Erro ao atualizar tarefa: ' + err));
        console.log(task)
    }
}

// Obter data e hora atual
const getDateTime = () => {

    const now = new Date();

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', timeOptions);

    const date = dateFormatter.format(now);
    const time = timeFormatter.format(now);

    document.querySelector('.hours').textContent = time;
    document.querySelector('.date').textContent = date.charAt(0).toUpperCase() + date.substring(1);

     // Chama a função novamente antes da próxima renderização do navegador
    requestAnimationFrame(getDateTime);
}

getDateTime();


// Limpa os inputs do modal
const clearInput = () => {
    document.querySelector('#inputTaskTitle').value = '';
    document.querySelector('#inputCategory').value = '';
    document.querySelector('#inputTime').value = '';
}

// Exibe as menssagens de erro
const showErrorMessage = (err) => {
    const errorClasses = {
        'Título': '.title.error',
        'Categoria': '.category.error',
        'tempo': '.time.error'
    };

    Object.entries(errorClasses).forEach(([errorText, errorClass]) => {
        const element = document.querySelector(errorClass);
        element.classList.add('d-none');

        if (err && err.message.includes(errorText)) {
            element.textContent = err.message;
            element.classList.remove('d-none');
        }
    });
};


// Eventos
window.addEventListener('load', async () => {
    await getTasks();
    renderTasks();
});

addTaskBtn.addEventListener('click', () => {
    showModal();
});

saveBtn.addEventListener('click', () => {
    try {
        if (isEditng) {
            updateTask(taskToEditId);
        } else {
            createNewTask();
        }
        hideModal();
        clearInput();
        showErrorMessage()
        isEditng = false;
    } catch (err) {
        showErrorMessage(err)
        console.error(err)
    }
});

cancelBtn.addEventListener('click', () => {
    hideModal();
    showErrorMessage()
    clearInput();
});