import type { Format } from "@/types";
import axios from "axios";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchFormats(): Promise<{
  formats: Format[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/formats`);
  return res.data;
}
