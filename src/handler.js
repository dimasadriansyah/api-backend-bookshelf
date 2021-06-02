const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 1 : API dapat menyimpan buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    let finished = false;
    if ( pageCount === readPage ) {
        finished = true;
    };

    const newBook = { name, year, author, summary, id, publisher, insertedAt, updatedAt, pageCount, readPage, reading, finished };
    books.push(newBook);
    
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
    };
    if (name === undefined) {
        const response = h.response ({
            status: 'fail', 
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };
    if (readPage > pageCount) {
        const response = h.response ({
            status: 'fail', 
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    };
    const response = h.response({
        status: 'error', 
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
  };

// Kriteria 2 : API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const { name, finished, reading } = request.query;
    if (reading !== undefined){
        const response = h.response ({
            status: 'success',
            data: {
                books: books.filter((book) => book.reading === (reading === '1')).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            },
        });
        response.code(200);
        return response;
    }
    if (reading === undefined){
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => book.reading === (reading === '0')).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            },
        });
        response.code(200);
        return response;
    }
    if (finished !== undefined){
        const response = h.response ({
            status: 'success',
            data: {
                books: books.filter((book) => book.finished === (finished === '1')).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            },
        });
        response.code(200);
        return response;
    }
    if (finished === undefined){
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => book.finished === (finished === '0')).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            },
        });
        response.code(200);
        return response;
    }
    if (name) {
        const response = h.response({
          status: 'success',
          data: {
            books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              }))
           },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
};
// Kriteria 3 : API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((book) => book.id === bookId)[0];
    if (book) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
// Kriteria 4 : API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response ({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}
  module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };