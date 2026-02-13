import { RadioSearchResponse } from "@/types/radio";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://radio.garden/api"

const client = axios.create({
    baseURL: API_URL
})

export async function GET(request: Request) {


    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const res = await client.get<RadioSearchResponse>(
        `/search?q=${encodeURIComponent(query)}`,

    );

    const results = res.data;

    const formattedResults = results.hits.hits.filter((station) => station._source.type === "channel").map((station) => {
        const id = station._source.page.url.split("/")[3]
        const data = station._source
        return {
            title: data.page.title,
            url: `${API_URL}/ara/content/listen/${id}/channel.mp3`,
            subtitle: data.page.subtitle
        }
    })

    return NextResponse.json({ results: formattedResults });


}