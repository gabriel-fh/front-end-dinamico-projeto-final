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

    #title;
    #category;
    #time;
    #completed;

    // Construtor

    constructor(title, category, time) {
        this.title = title;
        this.category = category;
        this.time = time;
        this.completed = false;
    }

    // Getters e Setters

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

    toJSON() {
        return {
            title: this.#title,
            category: this.#category,
            time: this.#time,
            completed: this.#completed,
        };
    }
}
