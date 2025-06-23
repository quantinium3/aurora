import { Elysia, t } from "elysia";
import {statTable, userTable} from "./db/scheme";
import { eq } from "drizzle-orm";
import { db } from ".";

export const users = new Elysia({ prefix: '/api/user' })
    .get('/:id', async ({ params, status }) => {
        try {
            let user = await db.selectDistinct().from(userTable).where(eq(userTable.id, params.id))
            return status(200, {
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    created_at: user[0].created_at,
                    updated_at: user[0].updated_at
                },
                message: 'successfully fetched stats'
            })
        } catch (err) {
            console.error("Failed to send stats: ", err)
            return status(500, {
                message: `failed to fetch stats for user with id: ${params.id}`,
            })
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
    })
    .post('/', async ({ status, body }) => {
        try {
            const user = await db.insert(userTable).values({
                name: body.name,
                email: body.email,
                password: await Bun.password.hash(body.password, {
                    algorithm: "bcrypt",
                    cost: 12
                })
            }).returning();

            await db.insert(statTable).values({
                user_id: user[0].id
            })

            return status(201, {
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    created_at: user[0].created_at,
                    updated_at: user[0].updated_at
                },
                message: `successfully created user with email: ${body.email}`
            })
        } catch (err) {
            console.error("failed to create user: ", err)
            return status(500, {
                message: `failed to create user with email: ${body.email}`
            })
        }
    }, {
        body: t.Object({
            name: t.String(),
            password: t.String(),
            email: t.String({format: "email"})
        })
    })
    .delete('/:id', async ({ params, status }) => {
        try {
            await db.delete(userTable).where(eq(userTable.id, params.id));
            return status(200, {
                message: `successfully deleted user with id: ${params.id}`
            })
        } catch (err) {
            console.error("Failed to delete user: ", err);
            return status(500, {
                message: `failed to delete user with id: ${params.id}`
            })
        }
    }, {
        params: t.Object({
            id: t.String()
        })
    })
