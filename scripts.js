import { books, authors, genres } from "./data.js";

console.log(books);

const searchbtn = document.querySelector('[data-header-search]');
console.log(searchbtn);
searchbtn.addEventListener("click", (event) => {
    console.log('clicked');
    searchOverlay();
});

function searchOverlay() {
    const search = document.querySelector('[data-search-overlay]');
    if (search) {
        search.showModal();
        const titleInput = document.querySelector('[data-search-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

const settingsbtn = document.querySelector('[data-header-settings]');
console.log(settingsbtn);
settingsbtn.addEventListener("click", (event) => {
    console.log('clicked');
    settingsOverlay();
});

function settingsOverlay() {
    const settings = document.querySelector('[data-settings-overlay]');
    if (settings) {
        settings.open = true;
        const titleInput = document.querySelector('[data-settings-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

const themes = {
    day: {
      dark: '10, 10, 20',
      light: '255, 255, 255',
    },
    night: {
      dark: '255, 255, 255',
      light: '10, 10, 20',
    },
};

const themeElements = document.querySelectorAll('[data-settings-theme]');

themeElements.forEach(themeElement => {
    themeElement.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const selectedValue = themeElement.getAttribute('data-settings-theme');
        console.log(selectedValue);
    });
});

const genreSelect = document.querySelector('[data-search-genres]');

for (const genre in genres) {
    if (Object.hasOwnProperty.call(genres, genre)) {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genres[genre];
        genreSelect.appendChild(option);
    }
}

genreSelect.addEventListener('click', () => {
    toggleGenreDropdownOptions(genreSelect);
});

genreSelect.addEventListener('change', () => {
    toggleGenreDropdownOptions(genreSelect);
});

function toggleGenreDropdownOptions(genreSelect) {
    if (genreSelect.hasAttribute('open')) {
        genreSelect.removeAttribute('open');
    } else {
        genreSelect.setAttribute('open', true);
    }
}

const authorSelect = document.querySelector('[data-search-authors]');

for (const author in authors) {
    if (Object.hasOwnProperty.call(authors, author)) {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = authors[author];
        authorSelect.appendChild(option);
    }
}

authorSelect.addEventListener('click', () => {
    toggleAuthorDropdownOptions(authorSelect);
});

authorSelect.addEventListener('change', () => {
    toggleAuthorDropdownOptions(authorSelect);
});

function toggleAuthorDropdownOptions(authorSelect) {
    if (authorSelect.hasAttribute('open')) {
        authorSelect.removeAttribute('open');
    } else {
        authorSelect.setAttribute('open', true);
    }
}

const listbtn = document.querySelector('[data-list-button]');
listbtn.innerText = 'show more';

const booksPerPage = 36;
let currentPage = 1;

function displayBooks() {
    const bookList = document.querySelector('[data-list-items]')
    bookList.innerHTML = '';

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = books.slice(startIndex, endIndex);

    for (const book of booksToDisplay) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('preview');

        const authorId = book.author;
        const authorName = authors[authorId] || 'Not specified';

        const image = document.createElement('img');
        image.classList.add('preview__image');
        image.src = book.image;
        image.alt = `${book.title} Image`;

        bookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p>Author: ${authorName}</p>
        `;
       
        bookCard.appendChild(image);

        bookCard.addEventListener('click', () => {
            displayBookDetails(book);
        });

        bookList.appendChild(bookCard);
    }
}

displayBooks();

const showMoreButton = document.querySelector('[data-list-button]');
showMoreButton.addEventListener('click', () => {
    currentPage++;
    displayBooks();
});

function displayBookDetails(book) {
    const modal = document.createElement('div');
    modal.classList.add('overlay__data');

    const overlayImage = document.createElement('img');
    overlayImage.classList.add('overlay__image');
    overlayImage.src = book.image;
    overlayImage.alt = `${book.title} Image`;

    const closeButton = document.createElement('button');
    closeButton.classList.add('overlay__button');
    closeButton.innerText = 'Close';

    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });

    modal.innerHTML = `
        <h2>${book.title}</h2>
        <p>Author: ${authors[book.author] || 'Not specified'}</p>
        <p>Genres: ${genres[book.genre] || 'Not specified'}</p>
        <img src="${book.image}">
        <p>Description: ${book.description}</p>
        <p>Pages: ${book.pages}</p>
        <p>Published: ${new Date(book.published).toLocaleDateString()}</p>
    `;

    const closeContainer = document.querySelector('[data-list-active]');
    closeContainer.appendChild(closeButton);

    const list = document.querySelector('[data-list-active]');
    list.innerHTML = '';
    list.appendChild(modal);
    if (list) {
        list.open = true;
        const blurImage = document.querySelector('[data-list-blur]');
        if (blurImage) {
            blurImage.focus();
        }
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.remove();
}

const searchInput = document.querySelector('[data-list-close]')
searchInput.addEventListener('click', () => {
    searchInput.remove()
});
