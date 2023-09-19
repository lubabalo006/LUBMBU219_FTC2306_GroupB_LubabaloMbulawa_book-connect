import { books, authors, genres } from "./data.js";

const searchbtn = document.querySelector('[data-header-search]');
const settingsbtn = document.querySelector('[data-header-settings]');
const search = document.querySelector('[data-search-overlay]');
const settings = document.querySelector('[data-settings-overlay]');
const themeSelect = document.querySelector('[data-settings-theme]');
const genreSelect = document.querySelector('[data-search-genres]');
const bookList = document.querySelector('[data-list-items]');
const searchGenre = document.querySelector('[data-search-overlay] [type="submit"]');
const authorSelect = document.querySelector('[data-search-authors]');
const searchAuthor = document.querySelector('[data-search-overlay] [type="submit"]');
const listbtn = document.querySelector('[data-list-button]');
const showMoreButton = document.querySelector('[data-list-button]');
const cancelSearchBtn = document.querySelector('[data-search-cancel]');
const cancelSettingBtn = document.querySelector('[data-settings-cancel]')

searchbtn.addEventListener("click", (event) => {
    searchOverlay();
});

// Function to open the search overlay when the search button is clicked
function searchOverlay() {   
    if (search) {
        search.showModal();
        const titleInput = document.querySelector('[data-search-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

// Event listener to close the search overlay when the cancel button is clicked
cancelSearchBtn.addEventListener('click', () => {
    closesearchOverlay();
});

// Function to close the search overlay
function closesearchOverlay() {   
    if (search) {
        search.close();
        const titleInput = document.querySelector('[data-search-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

settingsbtn.addEventListener("click", (event) => {
    settingsOverlay();
});

// Function to open the settings overlay when the settings button is clicked
function settingsOverlay() {
    if (settings) {
        settings.open = true;
        const titleInput = document.querySelector('[data-settings-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

// Event listener to close the settings overlay when the cancel button is clicked
cancelSettingBtn.addEventListener('click', () => {
    closeSettingOverlay();
});

// Function to close the settings overlay
function closeSettingOverlay() {   
    if (settings) {
        settings.close();
        const titleInput = document.querySelector('[data-search-form]');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

// Theme configuration
const themes = {
    day: {
      dark: 'var(--color-force-dark)',
      light: 'var(--color-force-light)',
    },
    night: {
      dark: 'var(--color-force-light)',
      light: 'var(--color-force-dark)',
      color: '--color-dark',
    },
};

const bodyElement = document.body;
let selectedValue;

// Function to apply the selected theme
function applyTheme() {
    const theme = themes[selectedValue];
    if (theme) {
      bodyElement.style.backgroundColor = `rgb(${theme.light})`;
      bodyElement.style.color = `rgb(${theme.dark})`;
    }
}

// Event listener for theme selection change
themeSelect.addEventListener('change', () => {
    selectedValue = themeSelect.value;
    applyTheme();
    localStorage.setItem('selectedTheme', selectedValue);
});

// Event listener for page load to set the theme
window.addEventListener('load', () => {
    selectedValue = localStorage.getItem('selectedTheme') || 'day';
    themeSelect.value = selectedValue;
    applyTheme();
});

applyTheme();

// Function to filter books by genre and author
function filterBooksByGenre(selectedGenre, selectedAuthor, searchTerm) {
    bookList.innerHTML = '';

    const filteredByGenre = books.filter((book) => book.genres.includes(selectedGenre));
    const filteredByAuthor = books.filter((book) => book.author.includes(selectedAuthor));
    const filteredBooks = filteredByGenre.filter((book) => filteredByAuthor.includes(book));

    for (const book of filteredBooks) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('preview');

        const genreNames = book.genres.map((genreId) => genres[genreId] || 'Not specified').join(', ');
        const authorId = book.author;
        const authorNames = authors[authorId] || 'Not specified';

        bookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p>Authors: ${authorNames}
            <p>Genres: ${genreNames}</p>
        `;

        bookList.appendChild(bookCard);
    }
}

// Function to populate the genre options
for (const genreId in genres) {
    if (Object.hasOwnProperty.call(genres, genreId)) {
        const option = document.createElement('option');
        option.value = genreId;
        option.textContent = genres[genreId];
        genreSelect.appendChild(option);
    }
}

// Event listener to filter books by genre when the search button is clicked
searchGenre.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedGenre = genreSelect.value;
    filterBooksByGenre(selectedGenre);

    const searchOverlay = document.querySelector('[data-search-cancel]');
    if (searchOverlay) {
        searchOverlay.close();
    }
});

// Call filterBooksByGenre initially with the default genre
const initialGenre = genreSelect.value;
filterBooksByGenre(initialGenre);

// Function to populate the author options
for (const author in authors) {
    if (Object.hasOwnProperty.call(authors, author)) {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = authors[author];
        authorSelect.appendChild(option);
    }
}

// Event listener to filter books by author when the search button is clicked
searchAuthor.addEventListener('click', (event) => {
    const selectedAuthor = authorSelect.value;
    filterBooksByGenre(genreSelect.value, selectedAuthor);

    const searchOverlay = document.querySelector('[data-search-overlay]');
    if (searchOverlay) {
        searchOverlay.close();
    }
})

// List button text and pagination
listbtn.innerText = 'show more';
const booksPerPage = 36;
let currentPage = 1;

// Function to display books with pagination
function displayBooks() {
    bookList.innerHTML = '';

   // Calculate the starting index of the books to display on the current page
const startIndex = (currentPage - 1) * booksPerPage;

// Calculate the ending index of the books to display on the current page
const endIndex = startIndex + booksPerPage;

// Create a new array 'booksToDisplay' containing a subset of 'books' from startIndex to endIndex
const booksToDisplay = books.slice(startIndex, endIndex);


    for (const book of booksToDisplay) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('preview');

        const authorId = book.author;
        const authorName = authors[authorId] || 'Not specified';

        const selectedTheme = themeSelect.value;
        const bookCardTheme = themes[selectedTheme];
        if (bookCardTheme) {
            bookCard.style.backgroundColor = `rgb(${bookCardTheme.light})`;
            bookCard.style.color = `rgb(${bookCardTheme.dark})`;
        }

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
// Initial display of books
displayBooks();

// Event listener for showing more books
showMoreButton.addEventListener('click', () => {
    currentPage++;
    displayBooks();
});

// Function to display book details in a modal
function displayBookDetails(book) {
    const bookOverlay = document.querySelector('[data-list-active]');
    bookOverlay.innerHTML = '';

    // Show the bookOverlay
    bookOverlay.style.display = 'block';

    const modal = document.createElement('div');
    modal.classList.add('overlay__content', 'overlay__data');

    // Apply the selected theme to the modal
    const selectedTheme = themeSelect.value;
    const modalTheme = themes[selectedTheme];
    if (modalTheme) {
        modal.style.backgroundColor = `rgb(${modalTheme.light})`;
        modal.style.color = `rgb(${modalTheme.dark})`;
    }

    const modalContent = document.createElement('div'); // Create a container for modal content
    modalContent.style.maxHeight = '80vh'; // Set a maximum height for the content
    modalContent.style.overflowY = 'scroll'; // Enable vertical scrolling if content exceeds the max height

    const overlayImage = document.createElement('img');
    overlayImage.classList.add('overlay__image');
    overlayImage.src = book.image;
    overlayImage.alt = `${book.title} Image`;

    const closeButton = document.createElement('button');
    closeButton.classList.add('overlay__button', 'overlay__button_primary');
    closeButton.innerText = 'Close';

    closeButton.addEventListener('click', () => {
        closeModal();
    });

    modalContent.innerHTML = `
        <h2>${book.title}</h2>
        <p>Author: ${authors[book.author] || 'Not specified'}</p>
        <img src="${book.image}" alt="${book.title} Image" class="preview__image" />
        <p>Description: ${book.description}</p>
    `;

    modal.appendChild(modalContent);
    modalContent.appendChild(closeButton); 
    bookOverlay.appendChild(modal);

    // Open the modal here if needed
    modal.open = true;

    function closeModal() {
        modal.open = false;
        // Hide the bookOverlay when closing the modal
        bookOverlay.style.display = 'none';
    }
}
