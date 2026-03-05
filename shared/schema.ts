import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const severityEnum = pgEnum("severity", ["low", "medium", "high", "critical"]);
export const incidentStatusEnum = pgEnum("incident_status", ["open", "investigating", "resolved", "closed"]);
export const alertTypeEnum = pgEnum("alert_type", ["weather", "security", "health", "fire", "general"]);
export const checkinStatusEnum = pgEnum("checkin_status", ["safe", "need_help", "emergency"]);

export const incidents = pgTable("incidents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: severityEnum("severity").notNull().default("medium"),
  status: incidentStatusEnum("status").notNull().default("open"),
  location: text("location").notNull(),
  reportedBy: text("reported_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  relationship: text("relationship").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const alerts = pgTable("alerts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: alertTypeEnum("type").notNull().default("general"),
  severity: severityEnum("severity").notNull().default("medium"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const safetyCheckins = pgTable("safety_checkins", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  status: checkinStatusEnum("status").notNull(),
  location: text("location"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true, createdAt: true });
export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertSafetyCheckinSchema = createInsertSchema(safetyCheckins).omit({ id: true, createdAt: true });

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type SafetyCheckin = typeof safetyCheckins.$inferSelect;
export type InsertSafetyCheckin = z.infer<typeof insertSafetyCheckinSchema>;
