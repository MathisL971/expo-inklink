import type { Discipline } from "@/types";
const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchDisciplines(): Promise<{
    disciplines: Discipline[];
    count: number;
}> {
    const res = await fetch(`${baseUrl}/disciplines`);
    return res.json();
};