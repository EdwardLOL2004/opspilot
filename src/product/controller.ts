import { api } from "encore.dev/api";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "./services";
import { checkAuthToken } from "../utils/jwt";
import { currentRequest } from "encore.dev";

export const getAll = api(
  {
    method: "GET",
    path: "/products",
  },
  async () => {
    const req = currentRequest();
    if (!req || req.type !== "api-call") {
      throw new Error("Unable to get API request context");
    }
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    const user = checkAuthToken({ authorization: authHeader });
    const products = await getAllProducts();

    return products;
  }
);


export const getById = api(
  {
    method: "GET",
    path: "/products/:id",
  },
  async ({ id }: { id: string }) => {
    const req = currentRequest();
    if (!req || req.type !== "api-call") {
      throw new Error("Unable to get API request context");
    }
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    const user = checkAuthToken({ authorization: authHeader });
    return getProductById(id);
  }
);

export const create = api(
  {
    method: "POST",
    path: "/products",
  },
  async ({ name, price, quantity }: { name: string; price: number; quantity: number }) => {
    const req = currentRequest();
    if (!req || req.type !== "api-call") {
      throw new Error("Unable to get API request context");
    }
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    const user = checkAuthToken({ authorization: authHeader });
    return createProduct({ name, price, quantity, userId: user.id });
  }
);





    
