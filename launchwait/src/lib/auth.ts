import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// For MVP, we use a simple in-memory/localStorage approach
// In production, use a proper database

// Simulated user store (in production, use database)
const users: Map<string, { id: string; email: string; name: string; password: string; plan: string }> = new Map();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' }, // 'signin' or 'signup'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email.toLowerCase();
        const action = credentials.action || 'signin';

        if (action === 'signup') {
          // Registration
          if (users.has(email)) {
            throw new Error('User already exists');
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const userId = `user_${Date.now()}`;
          
          const newUser = {
            id: userId,
            email,
            name: credentials.name || email.split('@')[0],
            password: hashedPassword,
            plan: 'free',
          };
          
          users.set(email, newUser);
          
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            plan: newUser.plan,
          };
        } else {
          // Login
          const user = users.get(email);
          
          if (!user) {
            // For demo purposes, create user if not exists
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const userId = `user_${Date.now()}`;
            
            const newUser = {
              id: userId,
              email,
              name: email.split('@')[0],
              password: hashedPassword,
              plan: 'free',
            };
            
            users.set(email, newUser);
            
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              plan: newUser.plan,
            };
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as { plan?: string }).plan || 'free';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { plan?: string }).plan = token.plan as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
};

// Helper to get user plan from server memory
export function getUserPlan(email: string): string {
  const user = users.get(email.toLowerCase());
  return user?.plan || 'free';
}

// Helper to update user plan
export function updateUserPlan(email: string, plan: string): void {
  const user = users.get(email.toLowerCase());
  if (user) {
    user.plan = plan;
    users.set(email.toLowerCase(), user);
  }
}
