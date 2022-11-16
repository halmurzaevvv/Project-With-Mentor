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

let first = document.querySelector(".remFirst");
let second = document.querySelector(".remSecond");


let profile = document.querySelector(".profile");
let profileBtn = document.querySelector(".profile-btn");

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
      let found = false;
      console.log(data);
      data.forEach((i) => {
        if (
          usernameSignIn.value == i.username && passwordSignIn.value == i.password
        ) {
          alert("Your account was find");
          found = true;
          let user = {
            username: i.username,
            id: i.id,
          };
          localStorage.setItem("user", JSON.stringify(user));
          console.log(data);
          return;
        }
      });
      if (!found) {
        alert("Your account is not found! Please register now");
      }

    });
});

function checkUser() {
  console.log(JSON.parse(localStorage.getItem("user")));
  let user = JSON.parse(localStorage.getItem("user"));
  if (JSON.parse(localStorage.getItem("user"))) {
    profile.style.display = `block`;
    profileBtn.style.display = `block`;
    profile.innerHTML = user.username;
    first.remove();
    second.remove();
  }
}
checkUser();

profileBtn.addEventListener("click", function () {
  localStorage.removeItem("user");
  first.style.display = "block";
  second.style.display = "block";
  profileBtn.remove();
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
      <a href="#" id=${element.id} class="btn btn-warning btn-cart">🛒</a>
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


//todo --------------------CART--------------------

let modalCart = document.querySelector(".modal-cart");
let cartBtn = document.querySelector(".btn-cart");

function getDataFromLS() {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", "[]");
  }
  let data = JSON.parse(localStorage.getItem("products"));
  return data;
}
getDataFromLS();
document.addEventListener(("click"), (e) => {
  if (e.target.classList.contains("btn-cart")) {
    let id = e.target.id;
    setCart(id);
  }
});
localStorage;


async function setCart(id) {
  await fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      let products = getDataFromLS();
      // console.log(products);
      products.push(data);
      // console.log(products);
      localStorage.setItem("products", JSON.stringify(products));


    });
}

cartBtn.addEventListener("click", function () {
  let products = getDataFromLS();
  let newElem = document.createElement("table");
  newElem.innerHTML += `
  <thead>
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Price</th>
      <th>Descr</th>
    </tr>
  </thead>
  `;
  products.forEach((e) => {
    let elem = drawItemLS(e);
    newElem.innerHTML += elem;
  });

  console.log(newElem);
  modalCart.append(newElem);
  console.log();
  console.log();
});


function drawItemLS(obj) {
  return `
  <tr>
      <th><img src=${obj.image} widht="100px" height="100px" /></th>
    </tr>
    <tr>
      <th>${obj.title}</th>
    </tr>
    <tr>
      <th>${obj.price}</th>
    </tr>
    <tr>
      <th>${obj.descr}</th>
    </tr>
    
      <button class="btn btn-danger btn-del" type="button" id=${obj.id}>
        Delete
      </button>
  `;
}