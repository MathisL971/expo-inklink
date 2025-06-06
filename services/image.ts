import axios from "axios";

const baseUrl = "https://offhu3yuna.execute-api.us-east-2.amazonaws.com/S3";

export async function deleteImage(key: string) {
  const res = await axios.delete(`${baseUrl}/image/${key}`);
  return res.data;
}
