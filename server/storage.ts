import {
  emergencyContacts,
  alertSettings,
  userPreferences,
  checkInTimers,
  safeLocations,
  type EmergencyContact,
  type InsertEmergencyContact,
  type AlertSetting,
  type InsertAlertSetting,
  type UserPreference,
  type InsertUserPreference,
  type CheckInTimer,
  type InsertCheckInTimer,
  type SafeLocation,
  type InsertSafeLocation,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getContacts(): Promise<EmergencyContact[]>;
  getContact(id: number): Promise<EmergencyContact | undefined>;
  createContact(data: InsertEmergencyContact): Promise<EmergencyContact>;
  updateContact(id: number, data: Partial<InsertEmergencyContact>): Promise<EmergencyContact>;
  deleteContact(id: number): Promise<void>;

  getAlertSettings(): Promise<AlertSetting[]>;
  createAlertSetting(data: InsertAlertSetting): Promise<AlertSetting>;
  updateAlertSetting(id: number, data: Partial<InsertAlertSetting>): Promise<AlertSetting>;

  getPreferences(): Promise<UserPreference[]>;
  createPreference(data: InsertUserPreference): Promise<UserPreference>;
  updatePreference(id: number, data: Partial<InsertUserPreference>): Promise<UserPreference>;

  getCheckInTimers(): Promise<CheckInTimer[]>;
  createCheckInTimer(data: InsertCheckInTimer): Promise<CheckInTimer>;
  updateCheckInTimer(id: number, data: Partial<InsertCheckInTimer>): Promise<CheckInTimer>;

  getSafeLocations(): Promise<SafeLocation[]>;
  createSafeLocation(data: InsertSafeLocation): Promise<SafeLocation>;
  updateSafeLocation(id: number, data: Partial<InsertSafeLocation>): Promise<SafeLocation>;
  deleteSafeLocation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getContacts(): Promise<EmergencyContact[]> {
    return db.select().from(emergencyContacts);
  }

  async getContact(id: number): Promise<EmergencyContact | undefined> {
    const [contact] = await db.select().from(emergencyContacts).where(eq(emergencyContacts.id, id));
    return contact;
  }

  async createContact(data: InsertEmergencyContact): Promise<EmergencyContact> {
    const [contact] = await db.insert(emergencyContacts).values(data).returning();
    return contact;
  }

  async updateContact(id: number, data: Partial<InsertEmergencyContact>): Promise<EmergencyContact> {
    const [contact] = await db.update(emergencyContacts).set(data).where(eq(emergencyContacts.id, id)).returning();
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
  }

  async getAlertSettings(): Promise<AlertSetting[]> {
    return db.select().from(alertSettings);
  }

  async createAlertSetting(data: InsertAlertSetting): Promise<AlertSetting> {
    const [setting] = await db.insert(alertSettings).values(data).returning();
    return setting;
  }

  async updateAlertSetting(id: number, data: Partial<InsertAlertSetting>): Promise<AlertSetting> {
    const [setting] = await db.update(alertSettings).set(data).where(eq(alertSettings.id, id)).returning();
    return setting;
  }

  async getPreferences(): Promise<UserPreference[]> {
    return db.select().from(userPreferences);
  }

  async createPreference(data: InsertUserPreference): Promise<UserPreference> {
    const [pref] = await db.insert(userPreferences).values(data).returning();
    return pref;
  }

  async updatePreference(id: number, data: Partial<InsertUserPreference>): Promise<UserPreference> {
    const [pref] = await db.update(userPreferences).set(data).where(eq(userPreferences.id, id)).returning();
    return pref;
  }

  async getCheckInTimers(): Promise<CheckInTimer[]> {
    return db.select().from(checkInTimers);
  }

  async createCheckInTimer(data: InsertCheckInTimer): Promise<CheckInTimer> {
    const [timer] = await db.insert(checkInTimers).values(data).returning();
    return timer;
  }

  async updateCheckInTimer(id: number, data: Partial<InsertCheckInTimer>): Promise<CheckInTimer> {
    const [timer] = await db.update(checkInTimers).set(data).where(eq(checkInTimers.id, id)).returning();
    return timer;
  }

  async getSafeLocations(): Promise<SafeLocation[]> {
    return db.select().from(safeLocations);
  }

  async createSafeLocation(data: InsertSafeLocation): Promise<SafeLocation> {
    const [location] = await db.insert(safeLocations).values(data).returning();
    return location;
  }

  async updateSafeLocation(id: number, data: Partial<InsertSafeLocation>): Promise<SafeLocation> {
    const [location] = await db.update(safeLocations).set(data).where(eq(safeLocations.id, id)).returning();
    return location;
  }

  async deleteSafeLocation(id: number): Promise<void> {
    await db.delete(safeLocations).where(eq(safeLocations.id, id));
  }
}

export const storage = new DatabaseStorage();
