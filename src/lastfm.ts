import {Elysia} from "elysia";
import axios from 'axios';

export const lastfm = new Elysia({prefix: "/api/lastfm"})
    .get("/current", async ({status}) => {
        try {
            const url = `${process.env.LASTFM_URI}/?method=user.getrecenttracks&user=${process.env.LASTFM_USERNAME}&api_key=${process.env.LASTFM_API}&format=json&limit=2`
            const res = await axios.get(url)
            return status(200, {
                message: "successfully fetched recent tracks",
                response: res.data.recenttracks
            })
        } catch(err) {
            console.error('failed to fetch lastfm track: ', err)
            return status(500, {
                message: "failed to fetch recent tracks from lastfm"
            })
        }
    })