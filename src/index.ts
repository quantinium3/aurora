import {Elysia} from "elysia";
import {stats} from "./stats";
import {users} from "./user";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { pingServer } from "./ping";
import {lastfm} from "./lastfm";
import { opentelemetry } from '@elysiajs/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { instrumentation } from "./instrumentation";


new Elysia()
    .use(instrumentation)
    opentelemetry({
        spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({
            url: 'http://localhost:4318/v1/traces',
        }))]
    })
    .use(cors())
    .use(swagger())
    .get('/api/healthz', ({status}) => {
        return status(200, {
            health: "ok"
        })
    })
    .use(lastfm)
    .use(pingServer)
    .use(stats)
    .use(users)
    .listen(4000)

console.log('server running at https://localhost:4000')
