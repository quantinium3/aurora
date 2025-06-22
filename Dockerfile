FROM oven/bun:1 AS build

WORKDIR /app

RUN apt-get update && apt-get install -y iputils-ping && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src
ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base-debian11

WORKDIR /app

COPY --from=build /app/server server

COPY --from=build /bin/ping /bin/ping
COPY --from=build /lib/x86_64-linux-gnu/libresolv.so.2 /lib/x86_64-linux-gnu/libresolv.so.2
COPY --from=build /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
COPY --from=build /lib64/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 4000
