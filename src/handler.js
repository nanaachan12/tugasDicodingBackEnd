const { nanoid } = require("nanoid"); // Mengimpor nanoid untuk menghasilkan ID unik
const books = require("./books"); //// Mengimpor array books dari file books.js

// Fungsi untuk menambahkan buku baru
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload; // Mengambil data buku dari request payload

  // Validasi: name buku wajib diisi
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400); // Mengatur status code menjadi 400 (Bad Request)
    return response; //kembalikan variabel response
  }

  // Validasi: readPage ≤ pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400); // Mengatur status code menjadi 400 (Bad Request)
    return response; //kembalikan variabel response
  }

  const id = nanoid(16); // Membuat ID unik untuk buku baru
  const insertedAt = new Date().toISOString(); // Waktu saat buku ditambahkan
  const updatedAt = insertedAt; // Waktu pembaruan awal
  const finished = pageCount === readPage; //Menentukan apakah buku telah selesai dibaca

  // Membuat objek buku baru
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Menambahkan buku baru ke dalam array books
  books.push(newBook);

  // Memeriksa apakah buku berhasil ditambahkan
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id, // Mengembalikan ID buku yang baru ditambahkan
      },
    });
    response.code(201); // Mengatur status code menjadi 201 (Created)
    return response;
  }
  // Mengembalikan respons error jika penambahan buku gagal
  const response = h.response({
    status: "error",
    message:
      "Gagal menambahkan buku. Periksa kembali data yang Anda masukkan dan coba lagi.",
  });
  response.code(500); // Mengatur status code menjadi 500 (Internal Server Error)
  return response;
};

// Function getAllBooks
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  // Filter berdasarkan query parameter 'name'
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan query parameter 'reading'
  if (reading !== undefined) {
    const isReading = reading === "1";
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter berdasarkan query parameter 'finished'
  if (finished !== undefined) {
    const isFinished = finished === "1";
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  // Format respons dengan hanya menampilkan properti id, name, dan publisher
  const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));
  // Mengembalikan respons dengan data buku yang telah difilter
  return h.response({
    status: "success",
    data: {
      books: responseBooks,
    },
  });
};

// Function getBookById
const getBookById = (request, h) => {
  const { id } = request.params; // Mengambil ID dari parameter request

  const book = books.find((book) => book.id === id); // Mencari buku berdasarkan ID

  // Kondisi jika buku ditemukan, akan mengembalikan detail buku
  if (book) {
    return h
      .response({
        status: "success",
        data: {
          book, // Mengembalikan detail buku
        },
      })
      .code(200);
  }
  // Mengembalikan respons error jika buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404); // Mengatur status code menjadi 404 (Not Found)
  return response;
};

// Function editBookById
const editBookById = (request, h) => {
  const { id } = request.params; // Mengambil ID dari request.param

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload; // Mengambil data buku dari request.payload

  const updatedAt = new Date().toISOString(); // Waktu saat buku diperbarui

  // Validasi: name harus diisi
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Validasi: readPage ≤ pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id); // Mencari index buku berdasarkan ID

  // Kondisi jika buku ditemukan, maka data buku akan diperbarui
  if (index !== -1) {
    const finished = pageCount === readPage; // Menentukan apakah buku telah selesai dibaca

    books[index] = {
      ...books[index], // Menyalin data buku yang ada
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200); // Mengatur status code menjadi 200 (OK)
    return response;
  }
  // Mengembalikan respons error jika ID tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404); // Mengatur status code menjadi 404 (Not Found)
  return response;
};

// Function deleteBookById
const deleteBookById = (request, h) => {
  const { id } = request.params; // Mengambil ID dari parameter request

  const index = books.findIndex((book) => book.id === id); // Mencari index buku berdasarkan ID

  // Kondisi jika buku ditemukan, maka hapus buku dari array
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200); // Mengatur status code menjadi 200 (OK)
    return response;
  }

  // Mengembalikan respons error jika ID tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404); // Mengatur status code menjadi 404 (Not Found)
  return response;
};

// Mengekspor fungsi untuk digunakan di file lain
module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
