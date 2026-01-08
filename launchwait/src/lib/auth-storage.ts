'use client';

import { User } from '@/types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'launchwait_users';

// Get all users from localStorage
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get user by ID
export function getUserById(id: string): User | null {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

// Create new user
export async function createUser(email: string, password: string, name: string): Promise<User> {
  const users = getUsers();
  
  // Check if user already exists
  if (getUserByEmail(email)) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser: User = {
    id: uuidv4(),
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    plan: 'free',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  return newUser;
}

// Verify password
export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

// Update user
export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users[index];
}

// Update user subscription
export function updateUserSubscription(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  plan: User['plan'],
  status: User['subscriptionStatus']
): User | null {
  return updateUser(userId, {
    stripeCustomerId,
    stripeSubscriptionId,
    plan,
    subscriptionStatus: status,
  });
}

// Get user by Stripe customer ID
export function getUserByStripeCustomerId(customerId: string): User | null {
  const users = getUsers();
  return users.find((u) => u.stripeCustomerId === customerId) || null;
}
