import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const auditResults = pgTable("audit_results", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  score: integer("score").notNull(),
  summary: jsonb("summary").notNull(),
  issues: jsonb("issues").notNull(),
  seo: jsonb("seo").notNull(),
  tracking: jsonb("tracking").notNull(),
  actionPlan: jsonb("action_plan").notNull(),
  userId: integer("user_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertAuditResultSchema = createInsertSchema(auditResults).omit({
  id: true,
  timestamp: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AuditResult = typeof auditResults.$inferSelect;
export type InsertAuditResult = z.infer<typeof insertAuditResultSchema>;

// Audit specific schemas
export const auditRequestSchema = z.object({
  url: z.string().url("URL invalide"),
});

export const seoIssueSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["critical", "warning", "optimization"]),
  recommendation: z.string().optional(),
  impact: z.enum(["high", "medium", "low"]),
});

export const auditSummarySchema = z.object({
  passed: z.number(),
  warnings: z.number(),
  critical: z.number(),
  optimizations: z.number(),
});

export const actionPlanItemSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  timeframe: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type SEOIssue = z.infer<typeof seoIssueSchema>;
export type AuditSummary = z.infer<typeof auditSummarySchema>;
export type ActionPlanItem = z.infer<typeof actionPlanItemSchema>;
export type AuditRequest = z.infer<typeof auditRequestSchema>;
