import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fs from "fs";
const config = {
   rateLimit: {
      max: 30,
      timeWindow: "5 minute"
   },
   homePath: "./html/home.html",
   devPath: "./html/creator.html"
}

const fastify = Fastify({
   logger: true
})

fastify.register(cors, {
   origin: "*"
})

fastify.register(rateLimit, {
   max: config.rateLimit.max,
   timeWindow: config.rateLimit.timeWindow
})

fastify.register(swagger, {
   swagger: {
      info: {
         title: "SxyzJsnx - API",
         description: "base rest api use fastify/swagger.",
         version : "1.0.0"
      },
      tags: [
        {
           name: "tools", 
           description: "daftar endpoint tools"
        },
        //...
      ]
   }
})

await fastify.register(swaggerUi, {
   routePrefix: "/docs",
   uiConfig: {
      docExpansion: "list"
   }
})

/* endpoint dengan swagger */

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

fastify.get("/", async (request, reply) => {
  reply
   .type("text/html")
    .send(fs.readFileSync(config.homePath).toString())
})

fastify.get("/creator", async(request, reply) => {
   reply
     .type("text/html")
       .send(fs.readFileSync(config.devPath).toString())
})

fastify.listen({ port: 9999 }, (err, addres) => {
   if (err) {
      fastify.log.error(err);
      process.exit(1)
   }
   console.log(`Running in ${addres}`)
})