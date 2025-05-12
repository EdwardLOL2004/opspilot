import { api } from "encore.dev/api";
import { getAllUsers } from "./services";

export const getAll = api(
  {
    method: "GET",
    path: "/users",
  },
  async () => {
    return getAllUsers();
  }
);

