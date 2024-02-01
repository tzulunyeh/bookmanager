document.getElementById('save-url').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        document.getElementById('url').value = tabs[0].url;
    });
});

document.getElementById('add').addEventListener('click', () => {
    let title = document.getElementById('title').value;
    let url = document.getElementById('url').value;

    chrome.storage.sync.get({books: []}, (data) => {
        let books = data.books;
        books.push({title: title, url: url});
        chrome.storage.sync.set({books: books}, () => {
            updateBookList(books);
        });
    });
});

function updateBookList(books) {
    let list = document.getElementById('book-list');
    list.innerHTML = '';
    books.forEach((book, index) => {
        let item = document.createElement('div');
        let link = document.createElement('a');
        link.textContent = book.title;
        link.href = book.url;
        link.target = '_blank';  // 确保链接在新标签页中打开

        let deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除';
        deleteButton.addEventListener('click', function() {
            deleteBook(index);
        });

        item.appendChild(link);
        item.append(' ');  // 添加空格分隔书名和删除按钮
        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

function deleteBook(index) {
    chrome.storage.sync.get({books: []}, (data) => {
        let books = data.books;
        books.splice(index, 1);
        chrome.storage.sync.set({books: books}, () => {
            updateBookList(books);
        });
    });
}


// 初始加载书籍列表
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({books: []}, (data) => {
        updateBookList(data.books);
    });
});
