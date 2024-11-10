// Mengimpor modul Hapi untuk membuat server HTTP
const Hapi = require("@hapi/hapi");
// Mengimpor rute yang telah didefinisikan di file routes.js
const routes = require("./routes");

// Function untuk menginisialisasi server
const init = async () => {
  // Membuat instance server Hapi dengan konfigurasi port dan host
  const server = Hapi.server({
    port: 9000, // Port yang digunakan server
    host: "localhost", // Host tempat server berjalan
    routes: {
      cors: {
        origin: ["*"], // Mengizinkan akses dari semua origin
      },
    },
  });

  // Mengatur rute
  server.route(routes);

  // Menjalankan server dan menunggu hingga siap
  await server.start();
  // Menampilkan informasi bahwa server telah berjalan
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// Memanggil fungsi init untuk memulai server
init();
