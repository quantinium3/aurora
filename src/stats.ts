import {Elysia, t} from "elysia";
import 'dotenv/config';
import {eq, sql} from 'drizzle-orm'
import {drizzle} from 'drizzle-orm/node-postgres';
import {statTable} from "./db/scheme";

const db = drizzle(process.env.DATABASE_URL!)

export const stats = new Elysia({prefix: "/api/stats"})
    .put('/keyboard/:id', async ({params, body, status}) => {
        try {
            await db.transaction(async (tx) => {
                await tx
                    .update(statTable)
                    .set({
                        keypress: sql`${statTable.keypress}
                        +
                        ${sql`${body.keypress}`}`
                    })
                    .where(eq(statTable.user_id, params.id));
            });

            return status(200, {
                message: "successfully updated keypress"
            })
        } catch (err) {
            console.error("Update error:", err);
            return status(500, {
                message: "failed to update keypress",
            })
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            keypress: t.Number({minimum: 0, maximum: 1000000})
        })
    })
    .get('/:id', async ({params, status}) => {
        try {
            let stats = await db.selectDistinct().from(statTable).where(eq(statTable.id, params.id))
            return status(200, {
                stats: stats,
                message: 'successfully fetched stats'
            })
        } catch (err) {
            console.error("Failed to send stats: ", err)
            return status(500, {
                message: "failed to fetch stats",
            })
        }
    }, {
        params: t.Object({
            id: t.String()
        })
    })
    .put('/mouse/:id', async ({params, status, body}) => {
        try {
            let stats = await db
                .selectDistinct()
                .from(statTable)
                .where(eq(statTable.user_id, params.id))

            await db.update(statTable).set({
                mouse_travel: stats[0].mouse_travel + body.mouse_travel,
                left_click: stats[0].left_click + body.left_click,
                right_click: stats[0].right_click + body.right_click
            }).where(eq(statTable.user_id, params.id))

            return status(200, {
                message: "updated mouse stats successfully"
            })

        } catch (err) {
            console.error("Failed to update mouse stats")
            return status(500, {
                message: "Failed to update mouse stats"
            })
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            mouse_travel: t.Number({minimum: 0.0}),
            left_click: t.Number({minimum: 0}),
            right_click: t.Number({minimum: 0})
        })
    })
