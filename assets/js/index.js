const addTaskBtn = document.querySelector('.add-task-btn');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const myModal = new bootstrap.Modal(document.getElementById('myModal'));

addTaskBtn.addEventListener('click', () => {
    showModal()
});

saveBtn.addEventListener('click', () => {
    hideModal()
});

cancelBtn.addEventListener('click', () => {
    hideModal()
});

const showModal = () => {
    myModal.show();
}

const hideModal = () => {
    myModal.hide();
}


















// `<section
// class="row w-100 task-component my-3 mx-auto d-flex align-items-center"
// >
// <div class="col-auto p-0">
//   <div class="check-box-container">
//     <label class="form-check-label custom-check-box">
//       <input class="form-check-input d-none" type="checkbox" />
//       <div class="checkmark"></div>
//     </label>
//   </div>
// </div>
// <div class="task-content col p-0">
//   <span class="task-title text-dark">Academia</span>
//   <span class="task-details"
//     >Esportes e Saúde <span class="dot">•</span>
//     <iconify-icon icon="ic:outline-watch-later"></iconify-icon>
//     7:00</span
//   >
// </div>
// <div class="col-auto btn-content">
//   <button class="edit-btn">
//     <iconify-icon icon="solar:pen-bold"></iconify-icon>
//   </button>
//   <button class="delete-btn">
//     <iconify-icon icon="mdi:trash"></iconify-icon>
//   </button>
// </div>
// </section>`