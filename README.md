# BASE REST API

Sebuah fondasi REST API yang ringan dan siap produksi yang dibangun dengan Fastify dan dokumentasi Swagger yang komprehensif. Proyek ini menyediakan titik awal yang kuat untuk developer yang ingin membangun API yang scalable dengan dokumentasi otomatis dan fitur keamanan esensial.

## Gambaran Umum

Template REST API ini dirancang untuk mempercepat workflow pengembangan dengan menyediakan fondasi yang telah terkonfigurasi dengan praktik standar industri. Arsitektur ini menekankan kesederhanaan, maintainability, dan performa tinggi sambil menggabungkan fitur-fitur penting seperti rate limiting, penanganan CORS, dan dokumentasi API yang komprehensif.

## Dependensi Utama

### Framework Utama
- **Fastify** - Framework web performa tinggi dengan arsitektur plugin untuk Node.js
- **@fastify/cors** - Plugin Cross-Origin Resource Sharing untuk akses API yang aman

### Dokumentasi & Pengembangan
- **@fastify/swagger** - Plugin Swagger untuk Fastify
- **@fastify/swagger-ui** - Interface dokumentasi API yang interaktif

### Keamanan & Performa
- **@fastify/rate-limit** - Plugin rate limiting yang dapat dikonfigurasi untuk proteksi API

## Fitur Utama

### Performa Tinggi
Fastify menawarkan performa yang superior dibanding framework lainnya, dengan throughput hingga 2x lebih cepat dari Express.js berkat arsitektur yang dioptimalkan dan JSON parsing yang efisien.

### Schema Validation Bawaan
Setiap endpoint dapat memiliki validasi JSON Schema bawaan untuk request dan response, memastikan data integrity dan dokumentasi yang akurat.

### Plugin Architecture
Sistem plugin Fastify yang terorganisir memungkinkan ekstensibilitas yang mudah sambil menjaga performa dan isolasi fitur.

### Generasi Dokumentasi Otomatis
API ini memanfaatkan plugin Swagger Fastify untuk secara otomatis menghasilkan spesifikasi OpenAPI yang komprehensif langsung dari schema endpoint. Ini memastikan dokumentasi tetap sinkron dengan implementasi.

### Langkah-langkah Keamanan Bawaan
Rate limiting diimplementasikan untuk melindungi dari penyalahgunaan dengan konfigurasi 30 request per 5 menit per IP. Konfigurasi CORS memungkinkan akses terkontrol dari aplikasi web.

### Arsitektur Sederhana
Proyek ini mengikuti struktur yang mudah dipahami dimana semua konfigurasi terpusat di `fastify.js`, dan routes dapat diorganisir sebagai plugin terpisah. Pendekatan ini menghilangkan kompleksitas konfigurasi sambil mempertahankan performa optimal.

## Struktur Proyek

```
├── html/               # Tempat html untuk frontend
├── fastify.js         # Entry point aplikasi utama dengan konfigurasi
├── package.json       # Dependensi proyek dan script
└── README.md         # Dokumentasi proyek
```

## Memulai

### Prasyarat
- Node.js (versi 16.x atau lebih tinggi)
- npm atau yarn package manager

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/SxyzJsnx/base-api-fastify.git
cd base-api-fastify
```

2. Install dependensi:
```bash
npm install
```

3. Jalankan development server:
```bash
npm start
```

4. Akses dokumentasi API di `http://localhost:9999/docs`

### Konfigurasi Aplikasi

Semua konfigurasi ditangani langsung di `fastify.js` melalui object config:

```javascript
const config = {
   rateLimit: {
      max: 30,
      timeWindow: "5 minute"
   },
   homePath: "./html/home.html",
   devPath: "./html/creator.html"
}
```

## Dokumentasi API

Dokumentasi API interaktif dihasilkan secara otomatis dan tersedia di endpoint `/docs`. Interface ini memungkinkan developer untuk:

- Menjelajahi semua endpoint yang tersedia
- Menguji API calls langsung dari browser
- Melihat skema request/response dengan validasi
- Memahami struktur data yang diperlukan

## Konfigurasi Rate Limiting

API ini menyertakan rate limiting yang dapat dikonfigurasi untuk mencegah penyalahgunaan:

- **Window Default**: 5 menit
- **Limit Default**: 30 request per window per IP
- **Dapat Disesuaikan**: Modifikasi di object config

## Kebijakan CORS

Cross-Origin Resource Sharing dikonfigurasi untuk memungkinkan akses dari semua origin (`origin: "*"`). Konfigurasi ini dapat dimodifikasi untuk membatasi akses berdasarkan kebutuhan keamanan spesifik.

## Workflow Pengembangan

### Menambahkan Endpoint Baru

1. Tambahkan endpoint langsung di `fastify.js` dengan schema Fastify
2. Definisikan schema untuk request/response validation
3. Implementasikan handler function
4. Dokumentasi akan dihasilkan secara otomatis

### Contoh Endpoint dengan Schema

```javascript
fastify.get("/ping", {
   schema: {
      tags: ["tools"],
      summary: "Cek Ping Anda!",
      response: {
         200: {
            description: "success",
            type: "object",
            properties: {
               message: { type: "string" }
            }
         }
      }
   },
   handler: async (request, reply) => {
      reply.send({ message: "pong!" })
   }
})
```

### Contoh Endpoint dengan File HTML

```javascript
fastify.get("/", async (request, reply) => {
  reply
   .type("text/html")
    .send(fs.readFileSync(config.homePath).toString())
})
```

## Validasi Schema

Fastify menyediakan validasi JSON Schema bawaan yang powerful:

```javascript
fastify.post("/user", {
   schema: {
      body: {
         type: "object",
         properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" }
         },
         required: ["name", "email"]
      },
      response: {
         201: {
            type: "object",
            properties: {
               id: { type: "number" },
               name: { type: "string" },
               email: { type: "string" }
            }
         }
      }
   }
})
```

## Plugin Development

Untuk proyek yang lebih besar, endpoints dapat diorganisir sebagai plugin:

```javascript
// plugins/users.js
async function userRoutes(fastify, options) {
   fastify.get("/users", {
      schema: {
         tags: ["users"],
         response: {
            200: {
               type: "array",
               items: { $ref: "#/components/schemas/User" }
            }
         }
      }
   }, async (request, reply) => {
      // handler logic
   })
}

module.exports = userRoutes

// Registrasi di fastify.js
fastify.register(require('./plugins/users'), { prefix: '/api' })
```

## Testing

Fastify menyediakan utilities testing yang built-in:

```javascript
const tap = require('tap')
const { build } = require('./app')

tap.test('GET /ping', async (t) => {
   const app = build({ logger: false })
   
   const response = await app.inject({
      method: 'GET',
      url: '/ping'
   })
   
   t.equal(response.statusCode, 200)
   t.same(JSON.parse(response.payload), { message: 'pong!' })
})
```

## Deployment

### Production Build

```bash
node fastify.js
```

### Environment Variables

Konfigurasi production dapat menggunakan environment variables:

```javascript
const config = {
   rateLimit: {
      max: process.env.RATE_LIMIT_MAX || 30,
      timeWindow: process.env.RATE_LIMIT_WINDOW || "5 minute"
   },
   port: process.env.PORT || 9999
}
```

### Dukungan Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 9999
CMD ["node", "fastify.js"]
```

```bash
docker build -t base-fastify-api .
docker run -p 9999:9999 base-fastify-api
```

## Performa & Optimisasi

### Keunggulan Fastify

- **Throughput Tinggi**: 2x lebih cepat dari Express.js
- **Low Overhead**: Memory footprint yang minimal
- **JSON Parsing**: Parser JSON yang dioptimalkan
- **Schema Compilation**: Validasi yang di-compile untuk performa maksimal

### Tips Optimisasi

- Gunakan schema validation untuk semua endpoint
- Implementasikan caching untuk data yang sering diakses
- Gunakan clustering untuk multi-core utilization
- Enable compression untuk response besar

## Logging

Fastify menggunakan Pino logger yang sangat cepat:

```javascript
const fastify = Fastify({
   logger: {
      level: 'info',
      prettyPrint: process.env.NODE_ENV !== 'production'
   }
})

// Dalam handler
fastify.get('/test', async (request, reply) => {
   request.log.info('Test endpoint accessed')
   return { status: 'ok' }
})
```

## Praktik Keamanan Terbaik

API ini mengimplementasikan beberapa langkah keamanan:

- Rate limiting untuk mencegah penyalahgunaan
- CORS configuration untuk keamanan cross-origin
- Schema validation untuk input sanitization
- Request logging untuk monitoring

Rekomendasi tambahan:
- Implementasikan @fastify/helmet untuk security headers
- Gunakan @fastify/jwt untuk authentication
- Tambahkan input sanitization plugins

## Kontribusi

Kami menyambut kontribusi dari komunitas developer. Harap ikuti panduan berikut:

1. Fork repository
2. Buat feature branch
3. Implementasikan perubahan dengan test yang sesuai
4. Pastikan schema validation ditambahkan
5. Submit pull request dengan deskripsi detail

### Standar Kode

- Gunakan schema validation untuk semua endpoint
- Implementasikan proper error handling
- Sertakan dokumentasi schema yang lengkap
- Ikuti plugin architecture pattern

## Tujuan Edukatif

Proyek ini berfungsi sebagai sumber daya edukatif untuk developer yang belajar membangun REST API profesional dengan Fastify. Ini mendemonstrasikan:

- Implementasi Fastify modern dengan plugin architecture
- Schema validation dan dokumentasi otomatis
- Rate limiting dan keamanan API
- Performa optimization techniques
- Production deployment strategies

Tujuannya adalah menyediakan fondasi praktis dan terdokumentasi dengan baik yang dapat dipelajari, dimodifikasi, dan diperluas developer untuk proyek mereka sendiri.

## Troubleshooting

### Masalah Umum

**Port Sudah Digunakan**
```bash
Error: listen EADDRINUSE: address already in use :::9999
```
Solusi: Ubah port di konfigurasi atau matikan proses yang menggunakan port tersebut.

**Schema Validation Error**
```bash
body should be object
```
Solusi: Pastikan request body sesuai dengan schema yang didefinisikan.

**Plugin Registration Error**
```bash
Plugin already registered
```
Solusi: Pastikan plugin hanya diregistrasi sekali atau gunakan encapsulation context.

## Roadmap

Peningkatan yang direncanakan meliputi:

- Plugin authentication dengan JWT
- Database integration dengan Prisma/TypeORM  
- Advanced caching strategies
- Microservices architecture examples
- WebSocket support
- GraphQL integration

## Dukungan

Untuk pertanyaan, masalah, atau kontribusi, silakan merujuk ke issue tracker proyek atau hubungi maintainer.

## Penulis

**Sxyz (SxyzJsnx)**  
Full-stack developer yang fokus pada pembuatan sumber daya edukatif untuk komunitas developer.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file [LICENSE](LICENSE) untuk syarat dan ketentuan lengkap.

## Repository

**Repository**: https://github.com/SxyzJsnx/base-api-express.git

---

**Disclaimer**: Proyek ini ditujukan untuk tujuan edukatif dan pengembangan. Pastikan audit keamanan yang tepat sebelum melakukan deployment ke environment produksi.