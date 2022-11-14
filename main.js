// ? АПИ Для запросов
let API = "http://localhost:8000/posts";
let API_USERS = "http://localhost:8000/users";

//! Registration + Auth

//? sing up
let username = document.querySelector("#username");
let password = document.querySelector("#password");
let submit = document.querySelector("#submit");

//? sing in
let usernameSignIn = document.querySelector("#usernameSignIn");
let passwordSignIn = document.querySelector("#passwordSignIn");
let logIn = document.querySelector("#LogIn");

//! CRUD

let inp = document.querySelector(".inp");
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let descr = document.querySelector("#descr");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

//? инпуты из модалки
let editTitle = document.querySelector("#edit-title");
let editPrice = document.querySelector("#edit-price");
let editDescr = document.querySelector("#edit-descr");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

//? Pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

//? SEARCH
let searchInp = document.querySelector("#search");
let searchVal = "";

//? Блок куда добавляются карточки из функции render
let list = document.querySelector("#products-list");

//! REGISTRATION & AUTH

//? sing up
submit.addEventListener("click", async () => {
  let obj = {
    username: username.value,
    password: password.value,
  };

  if (!obj.username.trim() || !obj.password.trim()) {
    alert("fill the form field");
    return;
  }
  // console.log(obj);

  await fetch(API_USERS, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json",
    },
  });
});

//? sing in

logIn.addEventListener("click", async (e) => {
  let obj2 = {
    usernameSignIn: usernameSignIn.value,
    passwordSignIn: passwordSignIn.value,
  };
  if (!obj2.usernameSignIn.trim() || !obj2.passwordSignIn.trim()) {
    alert("fill the form field");
  }
  // console.log(obj2);

  await fetch(API_USERS)
    .then((res) => res.json())
    .then((data) => {
      for (let i of data) {
        if (
          usernameSignIn.value == i.username && passwordSignIn.value == i.password
        ) {
          alert("Your account was find");
          console.log("Your account was find");
          // usernameSignIn.value = "";
          // passwordSignIn.value = "";
          // console.log(data);
          break;
        } else if (
          continue;
        passwordSignIn.value !== i.password && usernameSignIn.value !== i.username
        ) {
    // continue;
  } else {
    // console.log("Your account is not found! Please register now");
    alert("Your account is not found! Please register now");
    // usernameSignIn.value = "";
    // passwordSignIn.value = "";
  }
}
    });

  // await fetch(API_USERS)
  //   .then((res) => res.json())
  //   .then((data) =>
  //     data.forEach(function (elem, i) {
  //       // console.log(data);
  //       if (
  //         usernameSignIn.value == elem.username &&
  //         passwordSignIn.value == elem.password
  //       ) {
  //         alert("Your account was find");
  //         // console.log("Your account was find");
  //         usernameSignIn.value = "";
  //         passwordSignIn.value = "";
  //         // console.log(data);

  //         return true;
  //       } else {
  //         // alert("Your account is not found! Please register now");
  //         console.log("Your account is not found! Please register now");
  //         usernameSignIn.value = "";
  //         passwordSignIn.value = "";
  //         // console.log(data);

  //         return true;
  //       }
  //       // return
  //     })
  //   );
});

// ! ADD - Обработчик событий на добавление
btnAdd.addEventListener("click", async function (e) {
  //   e.preventDefault();
  // собираем обьект для добавления в дб.жсон
  let obj = {
    title: title.value,
    price: price.value,
    descr: descr.value,
    image: image.value,
  };

  // проверим - создается ли он
  console.log(obj);

  if (
    !obj.title.trim() ||
    !obj.price.trim() ||
    !obj.descr.trim() ||
    !obj.image.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  //! Запрос на добавление

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json",
    },
  });

  title.value = "";
  price.value = "";
  descr.value = "";
  image.value = "";

  render();
});

//! Отображение из json-server

async function render() {
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=3`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err)); //Отловим ошибку
  drawPaginationButtons();
  list.innerHTML = "";
  products.forEach((element) => {
    console.log(element);
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `
    <div class="card m-5" style="width: 18rem;">
    <img src=${element.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">${element.descr}</p>
      <p class="card-text">$ ${element.price}</p>
      <a href="#" id=${element.id} class="btn btn-danger btn-delete">DELETE</a>
      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id} class="btn btn-dark btn-edit">EDIT</a>
    </div>
  </div>`;
    list.prepend(newElem);
  });
}
render();

//! Удаление продукта

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => render());
  }
});

//! Редактирование продукта
//? Открываем модалку и
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.title;
        editPrice.value = data.price;
        editDescr.value = data.descr;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let title = editTitle.value;
  let price = editPrice.value;
  let descr = editDescr.value;
  let image = editImage.value;

  if (!title || !descr || !image || !price) {
    return;
  }
  let editProduct = {
    title: title,
    price: price,
    descr: descr,
    image: image,
  };
  saveEdit(editProduct, id);
});

//! Функция запроса для сохранения
function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => {
    render();
  });
  // закрытие модалки
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

// todo PAGINATION
function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3); //*CEIL - округление
      // общее количество продуктов делим на кол-во продуктов которые отображаются на одной странице
      //pageTotalCount = кол-во страниц
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        // создаем кнопки с цифрами
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active">
          <a class="page-link page_number" href="#">${i}</a>
      </li>
  `;
          paginationList.append(page1);
        } else {
          let page2 = document.createElement("li");
          page2.innerHTML = `<li class="page-item ">
          <a class="page-link page_number" href="#">${i}</a>
      </li>
  `;
          paginationList.append(page2);
        }
      }
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.remove("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
  }
});

//todo SEARCH

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value; //записывает знеачение поисковика в переменную searchVal
  currentPage = 1;
  render();
});
