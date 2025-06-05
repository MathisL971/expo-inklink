import type { Discipline } from "@/types";
import axios from "axios";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchDisciplines(): Promise<{
  disciplines: Discipline[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/disciplines`);
  return res.data;
}
