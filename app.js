function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI() {}

UI.prototype.addBookToList = function(book) {
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

UI.prototype.deleteBookFromList = function(target) {
    if (target.className == 'delete') {
        target.closest('tr').remove();
    }
}

UI.prototype.clearFields = function(form) {
    for (let input of form.querySelectorAll('input[type=text]')) {
        input.value = '';
    }
}

UI.prototype.flashMessage = function(message, type) {
    const container = document.querySelector('.container');

    const div = document.createElement('div');   
    classes = 'alert ' + type; 
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
        ui.clearFields(form);
        ui.flashMessage('Book added', 'success');
    }    
});

document.querySelector('#book-table tbody').addEventListener('click', function(e) {
    e.preventDefault();

    const ui = new UI();
    ui.deleteBookFromList(e.target);
    ui.flashMessage('Book deleted', 'success');
})