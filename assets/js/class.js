// Classe de erros
class ModelException extends Error {
    constructor(errorMsg) {
        super(errorMsg);
    }
}

// Classe da tarefa
class Task {
    // Atributos

    static count = 1;

    #id;
    #title;
    #category;
    #time;
    #completed;

    // Construtor

    constructor(title, category, time, completed) {
        this.#id = Task.count++;
        this.title = title;
        this.category = category;
        this.time = time;
        this.completed = completed;
    }

    // Getters e Setters

    get id() {
        return this.#id;
    };

    get title() {
        return this.#title;
    };

    set title(title) {
        Task.validateTitle(title);
        this.#title = title;
    };

    get category() {
        return this.#category;
    };

    set category(category) {
        this.#category = category
    };

    get time() {
        return this.#time;
    };

    set time(time) {
        Task.validateTime(time);
        this.#time = time;
    };

    get completed() {
        return this.#completed;
    };

    set completed(completed) {
        this.#completed = Task.markAsCompleted(completed);
    };

    // Metódos

    static validateTitle(title) {
        if (!title || title.trim() === '') {
            throw new ModelException('O campo "Título" é obrigatório!');
        }
        if (title.length < 3) {
            throw new ModelException('O campo "Título" deve possuir no mínimo 3 caracteres!');
        }
    };

    static validateTime(time) {
        if (time) {
            const splitTime = time.split(':');
            if (splitTime.length !== 2 || isNaN(parseInt(splitTime[0])) || isNaN(parseInt(splitTime[1]))) {
                throw new ModelException('Formato de hora inválido! Use "hh:mm"');
            }

            const hours = parseInt(splitTime[0], 10);
            const min = parseInt(splitTime[1], 10);

            if (hours < 0 || hours > 23 || min < 0 || min > 59) {
                throw new ModelException('Hora fora do intervalo válido! Use: (00:00 - 23:59)');
            }
        }
    };

    static markAsCompleted(completed) {
        return typeof completed === 'boolean' ? completed : false;
    }

}

// Classe da Lista de Tarefas
class ToDoList {

    // Atributo

    #tasks = [];

    // Getter
    get tasks() {
        return this.#tasks;
    }

    // Metódos
    addTask(task) {
        if (!(task instanceof Task)) {
            throw new ModelException('É permitido adicionar apenas tarefas à lista!');
        }

        this.#tasks.push(task);
    };

    #findTask(id) {
        const index = this.#tasks.findIndex(task => task.id === id);

        if (index < 0) {
            throw new ModelException('Tarefa não encontrada!');
        }

        return index;
    }

    completeTask(isCompleted, id) {
        const index = this.#findTask(id);
        const task = this.#tasks.splice(index, 1)[0];
        task.completed = isCompleted;
        this.#tasks.push(task);
    };

    updateTask(id, title, category, time) {
        for (const task of this.#tasks) {
            if (task.id === id) {
                task.title = title;
                task.category = category;
                task.time = time;
                break;
            }
        }

    };

    deleteTask(id) {
        const index = this.#findTask(id);
        this.#tasks.splice(index, 1);
    };
}
