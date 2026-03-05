import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const emergencyContacts = pgTable("emergency_contacts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  level: integer("level").notNull().default(3),
  relationship: text("relationship"),
});

export const alertSettings = pgTable("alert_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  level: integer("level").notNull(),
  activationPhrase: text("activation_phrase").notNull(),
  messageTemplate: text("message_template").notNull(),
  includeLocation: boolean("include_location").notNull().default(true),
  countryEmergencyNumber: text("country_emergency_number"),
});

export const userPreferences = pgTable("user_preferences", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  language: text("language").notNull().default("en"),
  systemArmed: boolean("system_armed").notNull().default(false),
  voiceSensitivity: real("voice_sensitivity").notNull().default(0.7),
  decoyMode: boolean("decoy_mode").notNull().default(true),
});

export const checkInTimers = pgTable("check_in_timers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  isActive: boolean("is_active").notNull().default(false),
  checkInBy: timestamp("check_in_by"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  alertLevel: integer("alert_level").notNull().default(2),
  lastCheckIn: timestamp("last_check_in"),
  customMessage: text("custom_message"),
});

export const safeLocations = pgTable("safe_locations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  address: text("address"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radiusMeters: integer("radius_meters").notNull().default(100),
  autoDisarm: boolean("auto_disarm").notNull().default(true),
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true });
export const insertAlertSettingsSchema = createInsertSchema(alertSettings).omit({ id: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true });
export const insertCheckInTimerSchema = createInsertSchema(checkInTimers).omit({ id: true });
export const insertSafeLocationSchema = createInsertSchema(safeLocations).omit({ id: true });

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type AlertSetting = typeof alertSettings.$inferSelect;
export type InsertAlertSetting = z.infer<typeof insertAlertSettingsSchema>;
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferencesSchema>;
export type CheckInTimer = typeof checkInTimers.$inferSelect;
export type InsertCheckInTimer = z.infer<typeof insertCheckInTimerSchema>;
export type SafeLocation = typeof safeLocations.$inferSelect;
export type InsertSafeLocation = z.infer<typeof insertSafeLocationSchema>;
