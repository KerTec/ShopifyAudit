import { auditResults, users, type User, type InsertUser, type AuditResult, type InsertAuditResult } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { customerId: string; subscriptionId: string }): Promise<User>;
  
  // Audit results
  saveAuditResult(result: InsertAuditResult): Promise<AuditResult>;
  getAuditResult(id: number): Promise<AuditResult | undefined>;
  getRecentAudits(limit?: number): Promise<AuditResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private auditResults: Map<number, AuditResult>;
  private currentUserId: number;
  private currentAuditId: number;

  constructor() {
    this.users = new Map();
    this.auditResults = new Map();
    this.currentUserId = 1;
    this.currentAuditId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string; subscriptionId: string }): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: info.customerId, 
      stripeSubscriptionId: info.subscriptionId 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async saveAuditResult(result: InsertAuditResult): Promise<AuditResult> {
    const id = this.currentAuditId++;
    const auditResult: AuditResult = {
      ...result,
      id,
      timestamp: new Date(),
      userId: null,
    };
    this.auditResults.set(id, auditResult);
    return auditResult;
  }

  async getAuditResult(id: number): Promise<AuditResult | undefined> {
    return this.auditResults.get(id);
  }

  async getRecentAudits(limit: number = 10): Promise<AuditResult[]> {
    const results = Array.from(this.auditResults.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    return results;
  }
}

export const storage = new MemStorage();
