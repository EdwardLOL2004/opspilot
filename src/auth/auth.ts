import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { jwt } from "better-auth/plugins"

const prisma = new PrismaClient();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-development',
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "User",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    disableSessionRefresh: true,
  },
  plugins: [
    jwt(),
  ],
});


/**
 * Verifies a token and returns the decoded payload
 * @param token The token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = async (token: string) => {
  try {
    console.log('Verifying token...');

    const session = await prisma.session.findFirst({
      where: { token },
      select: {
        userId: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!session) {
      console.log('Session not found');
      return null;
    }

    console.log('Found session:', session);
    return {
      userId: session.userId,
      user: session.user
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

/**
 * Gets user information from a token
 * @param token The token containing user information
 * @returns The user information or null if token is invalid
 */
export const getUserFromToken = async (token: string) => {
  try {
    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return null;
    }

    return decoded.user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

export const Logout = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      console.log('User not found');
      return null;
    }

    await prisma.session.deleteMany({ 
      where: { userId: user.id },
    });

    return {
      success: true,
      message: "User logged out from all sessions",
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: "Failed to log out user",
    };
  }
}

