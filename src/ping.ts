import {Elysia, t} from "elysia";
import ping from "ping"

const pingHost = (hostname: string): Promise<boolean> =>  {
    return new Promise((resolve) => {
        ping.sys.probe(hostname, (isAlive) => {
            resolve(isAlive!);
        }, {timeout: 5});
    })
}
export const pingServer = new Elysia({prefix: "/api/ping"})
    .post('/', async ({body, status}) => {
        try {
            const isAlive = await pingHost(body.hostname)
            return status(200, {
                status: isAlive ? "Ok" : "Err",
                time: new Date().getTime()
            });
        } catch(err) {
            console.error(`ping failed for ${body.hostname}: `, err)
            return status(500, {
                status: "Err",
                message: "ping operation failed",
                time: new Date().getTime()
            })
        }
    }, {
        body: t.Object({
            hostname: t.String()
        })
    })
