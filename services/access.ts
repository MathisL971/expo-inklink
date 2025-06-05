import { Access } from "@/types";
import axios from "axios";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchAccesses(): Promise<{
  accesses: Access[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/accesses`);
  return res.data;
}
