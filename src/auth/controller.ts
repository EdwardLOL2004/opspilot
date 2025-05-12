import { api } from "encore.dev/api";
import { auth, Logout } from "./auth";
import { generateJWT } from "../utils/jwt";


export const register = api(
  {
    method: "POST",
    path: "/auth/register",
  },
  async ({ email, password, name }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      await auth.api.signUpEmail({ body: { name, email, password } });
      const { token, user } = await auth.api.signInEmail({ body: { email, password } });
      return { success: true, data: { token, user } };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register user');
    }
  }
);

export const login = api(
  {
    method: "POST",
    path: "/auth/login",
  },
  async ({ email, password, }: { email: string; password: string }) => {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email,
          password
        }
      });
      const user = result.user;

      // Generate custom JWT
      const customToken = generateJWT({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      return {
        success: true,
        token: customToken,
        user: user
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }
);

export const logout = api(
  {
    method: "POST",
    path: "/auth/logout",
  },
  async ({ email }: { email: string }) => {
    try {
      // Find the user by email
        const user = await Logout(email)

      return {
        success: true,
        message: "User logged out from all sessions",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: "Failed to log out user",
      };
    }
  }
);