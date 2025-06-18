import {Elysia} from "elysia";

export const users = new Elysia({prefix: '/api/user'})
    .get('/', 'get user')
    .post('/', 'create user')
    .delete('/', 'delete user')
