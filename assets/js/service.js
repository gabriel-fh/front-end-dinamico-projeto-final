const API_URL = 'https://crudcrud.com/api/';
const API_KEY = 'f321af39f5ea4ffb88b8de6b99add7e3';

const sendData = async (task) => {
    try {
        await fetch(`${API_URL}${API_KEY}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task.toJSON())
        });
    } catch (err) {
        throw err;
    }
}

const getData = async () => {
    try {
        const response = await fetch(`${API_URL}${API_KEY}/tasks`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Erro:', err);
        throw err;
    }
}

const updateData = async (id, task) => {
    try {
        await fetch(`${API_URL}${API_KEY}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        })
    } catch (err) {
        throw err
    }
}

const deleteData = async (id) => {
    try {
        await fetch(`${API_URL}${API_KEY}/tasks/${id}`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err)
    }
}