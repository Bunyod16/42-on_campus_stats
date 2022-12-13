import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export async function getAllCurrentActiveUsers() {
  try {
    const response = await client.get("/on-campus/active-users");
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
