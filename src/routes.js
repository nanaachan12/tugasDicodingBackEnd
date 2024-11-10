// Mengimpor fungsi yang menangani permintaan untuk buku dari modul 'handler.js'
const {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
} = require("./handler");

// Menentukan rute untuk aplikasi
const routes = [
  {
    // Menangani permintaan POST untuk menambahkan buku baru
    method: "POST",
    path: "/books",
    handler: addBook,
  },
  {
    // Menangani permintaan GET untuk mengambil semua buku
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  {
    // Menangani permintaan GET untuk mengambil buku berdasarkan ID
    method: "GET",
    path: "/books/{id}",
    handler: getBookById,
  },
  {
    // Menangani permintaan PUT untuk memperbarui buku berdasarkan ID
    method: "PUT",
    path: "/books/{id}",
    handler: editBookById,
  },
  {
    // Menangani permintaan DELETE untuk menghapus buku berdasarkan ID
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBookById,
  },
];

module.exports = routes;
