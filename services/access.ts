import { Access } from "@/types";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchAccesses(): Promise<{
    accesses: Access[];
    count: number;
}> {
    const res = await fetch(`${baseUrl}/accesses`);
    return res.json();
};