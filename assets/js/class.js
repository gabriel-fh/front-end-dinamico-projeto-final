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

    constructor(title, category, time) {
        this.#id = Task.count++;
        this.title = title;
        this.category = category;
        this.time = time;
        this.completed = false;
    }

    // Getters e Setters

    get id() {
        return this.#id;
    };

    get title() {
        return this.#title;
    };

    set title(title) {
        Task.validateField(title, 'Título');
        this.#title = title;
    };
    
    get category() {
        return this.#category;
    };
    
    set category(category) {
        Task.validateField(category, 'Cateoria');
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

    static validateField(content, field) {
        if (!content || content.trim() === '') {
            throw new ModelException(`O campo "${field}" é obrigatório!`);
        }
        if (content.length < 3) {
            throw new ModelException(`O campo "${field}" deve possuir no mínimo 3 caracteres!`);
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
    
        if (index !== -1) {
            const task = this.#tasks.splice(index, 1)[0];
    
            if (isCompleted) {
                this.#tasks.push(task);
            } else {
                const lastIncompleteIndex = this.#tasks.reduceRight((acc, task, currentIndex) => {
                    if (!task.completed && acc === -1) {
                        acc = currentIndex;
                    }
                    return acc;
                }, -1);
    
                if (lastIncompleteIndex !== -1) {
                    this.#tasks.splice(lastIncompleteIndex + 1, 0, task);
                } else {
                    this.#tasks.unshift(task);
                }
            }
    
            task.completed = isCompleted;
        }
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
