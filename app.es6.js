class Book {
    constructor(title, author, isbn) {
        Object.assign(this, {title, author, isbn});
    }
}

class BookStorage {
    static getBooks() {
        let books = localStorage.getItem('books');

        if (books === null) {
            books = [];
        } else {
            books = JSON.parse(books)
        }

        return books;
    }

    static addBook(book) {
        const books = BookStorage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = BookStorage.getBooks();
        for (let [index, book] of books.entries()) {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        }
        
        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI {
    displayBooks(books) {
        for (let book of books) {
            this.addBookToList(book);
        }
    }

    addBookToList(book) {
        const list = document.querySelector('#book-table tbody');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    deleteBookFromList(target) {
        if (target.className == 'delete') {
            target.closest('tr').remove();
        }
    }

    flashMessage(message, type) {
        const container = document.querySelector('.container');

        const div = document.createElement('div');   
        const classes = 'alert ' + type; 
        div.className = classes;
        div.innerText = message;
        if (container.firstChild.className == classes) {
            container.firstChild.remove();
        }
        container.prepend(div);
    
        setTimeout(() => {
            div.remove();
        }, 3000);
    }

    clearFields(form) {
        for (let input of form.querySelectorAll('input[type=text]')) {
            input.value = '';
        }
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function(e) {
    ui = new UI();
    ui.displayBooks(BookStorage.getBooks());
});

document.querySelector('#book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const book = new Book(form.title.value, form.author.value, form.isbn.value);
    const ui = new UI();

    let formValid = true;
    for (let textInput of form.querySelectorAll('input[type=text]')) {
        if (textInput.value === '') {
            ui.flashMessage('Please, fill in all fields', 'error');
            formValid = false;
            break;
        }
    }

    if (formValid) {
        ui.addBookToList(book);
        // Add book to LS
        BookStorage.addBook(book);
        console.log('hello');
        ui.clearFields(form);
        ui.flashMessage('Book added', 'success');
    }    
});

document.querySelector('#book-table tbody').addEventListener('click', function(e) {
    e.preventDefault();

    const ui = new UI();
    ui.deleteBookFromList(e.target);
    const bookIsbn = e.target.closest('tr').querySelector('td:nth-child(3)').innerText;
    BookStorage.removeBook(bookIsbn);
    ui.flashMessage('Book deleted', 'success');
})