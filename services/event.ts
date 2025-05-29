const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchEvents() {
  const res = await fetch(`${baseUrl}/events`);
  return res.json();
}
