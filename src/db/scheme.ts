import {
    pgTable,
    varchar,
    timestamp,
    bigint, doublePrecision
} from 'drizzle-orm/pg-core';
import {createId} from "@paralleldrive/cuid2";

const createNamespacedId = (name: string): string => {
    return name + "_" + createId()
}

export const userTable = pgTable('user', {
    id: varchar('id').$defaultFn(() => createNamespacedId('user')).primaryKey(),
    name: varchar('name').notNull().unique(),
    password: varchar().notNull(),
    email: varchar('email').notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
    deleted_at: timestamp('deleted_at')
});

export const statTable = pgTable('stats', {
    id: varchar('id').$defaultFn(() => createNamespacedId('stats')).primaryKey(),
    user_id: varchar('user_id').notNull().unique().references(() => userTable.id, {onDelete: "cascade", onUpdate: "restrict"}),
    keypress: bigint({mode: "number"}).notNull().default(0),
    mouse_travel: doublePrecision('mouse_travel').notNull().default(0.0),
    left_click: doublePrecision('left_click').notNull().default(0.0),
    right_click: doublePrecision('right_click').notNull().default(0.0),
});
