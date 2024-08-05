// Do your work here...
// console.log("Hello, world!");
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    // resetForm();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function resetForm() {
  const submitForm = document.getElementById("bookForm");
  for (input of submitForm) {
    input.value = "";
  }
}

const books = [];
const RENDER_EVENT = "render-book";

function addBook() {
  const titleBook = document.getElementById("bookFormTitle").value;
  const authorBook = document.getElementById("bookFormAuthor").value;
  const yearBook = document.getElementById("bookFormYear").value;
  const isCompletedBook = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();

  //   membuat object book
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    isCompletedBook
  );

  books.push(bookObject);
  // console.log(books);
  // console.log("jajaja");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return new Date().getTime();
}

// fungsi buat object
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
// document.addEventListener(RENDER_EVENT, function () {
//   // console.log(books);
// });
function makeBookItem(book) {
  const title = document.createElement("h3");
  title.innerText = book.title;
  const year = document.createElement("p");
  year.innerText = `Tahun : ${book.year}`;
  const author = document.createElement("p");
  author.innerText = `Author : ${book.author}`;

  const bookData = document.createElement("div");
  bookData.classList.add("bookData");
  bookData.append(title, year, author);

  const buttonDelete = document.createElement("button");
  buttonDelete.setAttribute("data-testid", "bookItemDeleteButton");
  buttonDelete.innerText = "Hapus Buku";
  buttonDelete.addEventListener("click", () => {
    removeBookFromlist(book.id);
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.setAttribute("data-testid", "bookItemEditButton");
  buttonEdit.innerText = "Edit Buku";

  const bookAction = document.createElement("div");
  bookAction.classList.add("bookAction");
  if (book.isCompleted) {
    const buttonComplete = document.createElement("button");
    buttonComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonComplete.innerText = "Belum selesai dibaca";
    buttonComplete.addEventListener("click", () => {
      undoReadingCompleted(book.id);
    });
    bookAction.append(buttonComplete, buttonDelete, buttonEdit);
  } else {
    const buttonComplete = document.createElement("button");
    buttonComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonComplete.innerText = "Selesai dibaca";
    buttonComplete.addEventListener("click", () => {
      addReadingToCompleted(book.id);
    });
    bookAction.append(buttonComplete, buttonDelete, buttonEdit);
  }

  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");
  bookItem.classList.add("bookItem");

  bookItem.append(bookData, bookAction);
  return bookItem;
}

function addReadingToCompleted(bookId) {
  // console.log("kamu telah selesai membaca : " + bookId);
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  // console.log(bookTarget);
}
function undoReadingCompleted(bookId) {
  // console.log("kamu belum selesai membaca : " + bookId);
  const bookTarget = findBook(bookId);

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  // console.log(bookTarget);
  saveData();
}

function removeBookFromlist(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  // console.log(bookTarget);

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}
// Simpan data ke local storage
function saveData() {
  // return console.log(isStorageExist());
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// document.addEventListener(SAVED_EVENT, function () {
//   console.log(localStorage.getItem(STORAGE_KEY));
// });
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById("incompleteBookList");
  incompleteBook.innerHTML = "";
  const completeBook = document.getElementById("completeBookList");
  completeBook.innerHTML = "";

  for (const book of books) {
    const bookELement = makeBookItem(book);
    if (!book.isCompleted) incompleteBook.append(bookELement);
    else completeBook.append(bookELement);
  }
});
