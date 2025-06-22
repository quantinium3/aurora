import { opentelemetry } from '@elysiajs/opentelemetry'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'

export const instrumentation = opentelemetry({
	instrumentations: [new PgInstrumentation()]
})
