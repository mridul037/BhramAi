// eslint-disable-file
import Together from "together-ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit;



export  default async function CallF(req) {
  let json = await req;
  let { prompt, userAPIKey, iterativeMode } = z
    .object({
      prompt: z.string(),
      iterativeMode: z.boolean(),
      userAPIKey: z.string().optional(),
    })
    .parse(json);

  // Add observability if a Helicone key is specified, otherwise skip
  let options = {};
  

  const client = new Together({ apiKey: "895ccfc176596f5f64a66e242414391cbab8828dcb0dc2fab5995ffec8a8d311" });

  

  if (ratelimit && !userAPIKey) {
    const identifier = getIPAddress();

    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return Response.json(
        "No requests left. Please add your own API key or try again in 24h.",
        {
          status: 429,
        },
      );
    }
  }

  let response;
  try {
     
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = await client.images.create({
      prompt,
      model: "black-forest-labs/FLUX.1-schnell",
      width: 1024,
      height: 768,
      seed: iterativeMode ? 123 : undefined,
      steps: 3, // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response_format: "base64", // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }); // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e) {
    return Response.json(
      { error: e.toString() },
      {
        status: 500,
      },
    );
  }

  return response.data[0];
}

export const runtime = "edge";

function getIPAddress() {
//   const FALLBACK_IP_ADDRESS = "0.0.0.0";
//   const forwardedFor = headers().get("x-forwarded-for");

//   if (forwardedFor) {
//     return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
//   }

//   return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
