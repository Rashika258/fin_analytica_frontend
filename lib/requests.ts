import { headers } from "next/headers";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
export async function getS3ObjectUrl(uuid: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/signed-url?uuid=${uuid}`,
    {
      method: "GET",
      headers: {
        Cookie: headers().get("cookie") || "",
      },
    }
  );
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }
  return res.json();
}

export async function getText(url:string) {
    const res = await fetch(
        `${process.env.BACKEND_URL}/v1/parsers/pdf/url`,
        {
            method:"POST",
            headers:{
                "X-API-Key": process.env.X_API_KEY as string,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({url})
        }
    )
}


export async function getExtractionData(uuid:string, status: Status) {
    const session = await getServerSession(authO)
}
