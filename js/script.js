const input = document.querySelector(".input-box input");
const btnInput = document.querySelector(".input-box button");
let listItemContainer = document.querySelector(".list-item ul");
const menuList = document.querySelectorAll(".menu .menu-list");
const checkboxBtn = document.querySelector(".setting input");
const errorMessage = document.querySelector(".clear .error");
const clearBtn = document.querySelector(".clear button");

let allDataLists = [];
let pendingData = [];
let completedData = [];
let storedList = [];
let isEdit = false;
let count = localStorage.getItem("count") ? localStorage.getItem("count") : 0;

// Kondisi ketika browser onload
window.onload = () => {
  let listItem = localStorage.getItem("listItem");
  if (listItem) {
    pendingData = localStorage.getItem("pendingData").split(",");
    completedData = localStorage.getItem("completedData").split(",");
    allDataLists = localStorage.getItem("listItem").split(",");
    if (!pendingData || pendingData == "") {
      pendingData = storedList;
    }

    if (!completedData || completedData == "") {
      completedData = [];
    }

    showListData("All");
  }
};

const data = (value, status, active, style) => {
  active ? active : (active = "");
  style ? style : (style = "pending");
  listItemContainer.innerHTML += `<li class="${style}">
     <p class="${active}">${value}</p>
     <div class="setting">
         <input class="checkbox" type="checkbox" ${status}>
         <h3 class="more">...</h3>
         <div class="edits">
             <div class="edit">
                 <i class="fa-regular fa-pen-to-square"></i>
                 <p onclick="editItem('${value}')">Edit</p>
             </div>
             <div class="delete">
                 <i class="fa-solid fa-trash"></i>
                 <p onclick="deleteItem('${value}')">Delete</p>
             </div>
         </div>
     </div>
   </li>`;
};

const showListData = (menu) => {
  listItemContainer.innerHTML = "";
  if (menu === "Pending") {
    for (let i = 0; i < pendingData.length; i++) {
      data(pendingData[i], "check");
    }
  } else if (menu === "Completed") {
    for (let i = 0; i < completedData.length; i++) {
      data(completedData[i], "checked", "active", "completed");
    }
  } else {
    for (let i = 0; i < pendingData.length; i++) {
      data(pendingData[i], "check");
    }
    for (let i = 0; i < completedData.length; i++) {
      data(completedData[i], "checked", "active", "completed");
    }
  }
};

// Menyimpan data ke local storage
const addLocalStorage = (input) => {
  allDataLists.push(input);
  localStorage.setItem(`listItem`, allDataLists);
};

// Menyimpan data pending dan completed ke local storage
const addDataStatus = () => {
  localStorage.setItem(`pendingData`, pendingData);
  localStorage.setItem("completedData", completedData);
};

const checkInput = (value) => {
  let isError;
  if (value === "") {
    errorMessage.innerText = "Tidak bisa memasukan nilai kosong";
    errorMessage.classList.add("active");
    isError = true;
  } else if (value !== "") {
    isError = false;
  }

  allDataLists.forEach((e) => {
    if (e === value) {
      errorMessage.innerText = "Tidak bisa memasukan nilai yang sama";
      errorMessage.classList.add("active");
      isError = true;
    }
  });
  setTimeout(() => {
    errorMessage.innerHTML = "";
    errorMessage.classList.remove("active");
  }, 2500);
  return isError;
};

// Menambahkan data ke pembungkus list-item
const addListItem = (e) => {
  e.preventDefault();
  input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);

  if (checkInput(input.value)) {
    return;
  } else {
    pendingData.push(input.value);
    addLocalStorage(input.value);
    errorMessage.classList.add("none");
    errorMessage.innerText = "Data berhasil ditambahkan";
    setTimeout(() => {
      errorMessage.classList.remove("none");
    }, 2500);
    addDataStatus();
    menuList.forEach((btn) => {
      if (btn.classList.contains("active")) {
        showListData(`${btn.innerText}`);
      }
    });
    input.value = "";
  }
};

// Mengedit data
const editItem = (e) => {
  disableAllBtn();
  for (let i = 0; i < allDataLists.length; i++) {
    if (e === allDataLists[i]) {
      input.value = allDataLists[i];
    }
  }
};

const saveItem = (e) => {
  for (let i = 0; i < allDataLists.length; i++) {
    if (e === allDataLists[i]) {
      allDataLists[i] = input.value;
    }
  }
  for (let i = 0; i < pendingData.length; i++) {
    if (e === pendingData[i]) {
      pendingData[i] = input.value;
    }
  }
  for (let i = 0; i < completedData.length; i++) {
    if (e === completedData[i]) {
      completedData[i] = input.value;
    }
  }

  localStorage.setItem(`listItem`, allDataLists);
  addDataStatus();
  enableAllBtn();
  menuList.forEach((btn) => {
    if (btn.classList.contains("active")) {
      showListData(`${btn.innerText}`);
    }
  });
  isEdit = false;
  input.value = "";
};

const editMode = (element) => {
  element.parentElement.classList.add("active");
  const dataElement =
    element.parentElement.parentElement.parentElement.parentElement.querySelector(
      "p"
    );
  const editContainer = element.parentElement;
  editContainer.querySelector(
    "p"
  ).outerHTML = `<p onclick="saveItem('${dataElement.innerText}')">Save</p>`;
  editContainer.querySelector(
    "i"
  ).outerHTML = `<i class="fa-regular fa-floppy-disk"></i>`;
  isEdit = true;
};

// Menghapus data
const deleteItem = (e) => {
  for (let i = 0; i < allDataLists.length; i++) {
    if (e === allDataLists[i]) {
      removeElement(allDataLists, allDataLists[i]);
    }
  }
  for (let i = 0; i < pendingData.length; i++) {
    if (e === pendingData[i]) {
      removeElement(pendingData, pendingData[i]);
    }
  }
  for (let i = 0; i < completedData.length; i++) {
    if (e === completedData[i]) {
      removeElement(completedData, completedData[i]);
    }
  }

  addDataStatus();
  enableAllBtn();
  errorMessage.classList.add("active");
  errorMessage.innerText = "Data berhasil dihapus";
  setTimeout(() => {
    errorMessage.classList.remove("active");
  }, 2500);
  localStorage.setItem(`listItem`, allDataLists);
  showListData("All");
  input.value = "";
};

// Menghilangkan data dalam array
const removeElement = (array, element) => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  localStorage.setItem(`listItem`, allDataLists);
};

// Merubah gaya tombol
const changeStyleBtn = (btn) => {
  for (let i = 0; i < menuList.length; i++) {
    menuList[i].classList.remove("active");
  }
  btn.classList.add("active");
};

// Mematikan fungsi tombol di css ketika di mode edit
const disableAllBtn = () => {
  const checkbox = document.querySelectorAll(".checkbox");
  const more = document.querySelectorAll(".setting h3");
  btnInput.classList.add("disable");
  menuList.forEach((btn) => {
    btn.classList.add("disable");
  });
  checkbox.forEach((btn) => {
    btn.classList.add("disable");
  });
  more.forEach((btn) => {
    btn.classList.add("disable");
  });
};

// Menghidupkan kembali tombol css
const enableAllBtn = () => {
  const checkbox = document.querySelectorAll(".checkbox");
  const more = document.querySelectorAll(".setting h3");
  btnInput.classList.remove("disable");
  menuList.forEach((btn) => {
    btn.classList.remove("disable");
  });
  checkbox.forEach((btn) => {
    btn.classList.remove("disable");
  });
  more.forEach((btn) => {
    btn.classList.remove("disable");
  });
};

// Menampilkan tombol hapus dan edit
const showEditBtn = (element) => {
  const editContainer = element.parentElement.querySelector("p");
  const editElement = element.parentElement.querySelector(".edits");
  if (editElement.classList.contains("active")) {
    editElement.classList.remove("active");
  } else {
    editElement.classList.add("active");
  }

  window.addEventListener("click", (e) => {
    if (isEdit) {
      return;
    } else if (e.target !== editElement && e.target !== element.parentElement) {
      editElement.classList.remove("active");
    }
  });
};

// Hapus semua data
const deleteAllItem = () => {
  if (allDataLists == "") {
    errorMessage.classList.add("active");
    errorMessage.innerText = "Data tidak ditemukan";
    setTimeout(() => {
      errorMessage.classList.remove("active");
    }, 2500);
  }
  localStorage.clear();
  allDataLists = [];
  pendingData = [];
  completedData = [];
  showListData("All");
  input.value = "";
};

// Ketika tombol add diklik
btnInput.addEventListener("click", addListItem);

// Ketika tombol delete diklik
clearBtn.addEventListener("click", deleteAllItem);

// Ketika tombol menu diklik
menuList.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showListData(e.target.innerText);
    changeStyleBtn(e.target);
  });
});

// Ketika tombol checkbox diklik
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const checkboxParent = e.target.parentElement.parentElement;
    const dataElement = checkboxParent.querySelector("p");
    const checkbox = e.target;
    if (checkbox.checked) {
      completedData.push(dataElement.innerText);
      dataElement.classList.add("active");
      removeElement(pendingData, dataElement.innerText);
    } else {
      pendingData.push(dataElement.innerText);
      dataElement.classList.remove("active");
      removeElement(completedData, dataElement.innerText);
    }
    menuList.forEach((btn) => {
      if (btn.classList.contains("active")) {
        showListData(`${btn.innerText}`);
      }
    });
    addDataStatus();
  }

  if (e.target.classList.contains("more")) {
    showEditBtn(e.target);
  }

  if (e.target.parentElement.classList.contains("edit")) {
    editMode(e.target);
  }
});
