import {Elysia} from "elysia";
import {stats} from "./stats";
import {users} from "./user";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

new Elysia()
    .use(cors())
    .use(swagger())
    .get('/healthz', 'server is running')
    .get('/ping', 'pinging server')
    .use(stats)
    .use(users)
    .listen(3000)

console.log('server running at https://localhost:3000')
