import { Elysia, t } from "elysia";
import net from "net"

const pingHost = (host: string, port = 80, timout = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timout)
        socket.once("error", () => resolve(false))
        socket.once("timeout", () => {
            socket.destroy();
            resolve(false)
        })
        socket.connect(port, host, () => {
            socket.end();
            resolve(true)
        })
    })
}

export const pingServer = new Elysia({ prefix: "/api/ping" })
    .post('/', async ({ body, status }) => {
        try {
            const isAlive = await pingHost(body.hostname, body.port, body.timeout)
            return status(200, {
                status: isAlive ? "Ok" : "Err",
                time: new Date().getTime()
            });
        } catch (err) {
            console.error(`ping failed for ${body.hostname}: `, err)
            return status(500, {
                status: "Err",
                message: "ping operation failed",
                time: new Date().getTime()
            })
        }
    }, {
        body: t.Object({
            hostname: t.String().default("google.com"),
            port: t.Number().default("80"),
            timeout: t.Number().default("1000")
        })
    })
