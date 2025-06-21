import {Elysia} from "elysia";
import {stats} from "./stats";
import {users} from "./user";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import {pingServer} from "./ping";

new Elysia()
    .use(cors())
    .use(swagger())
    .get('/api/healthz', ({status}) => {
        return status(200, {
            health: "ok"
        })
    })
    .use(pingServer)
    .use(stats)
    .use(users)
    .listen(3000)

console.log('server running at https://localhost:3000')
