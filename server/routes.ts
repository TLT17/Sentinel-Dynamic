import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEmergencyContactSchema,
  insertAlertSettingsSchema,
  insertUserPreferencesSchema,
  insertCheckInTimerSchema,
  insertSafeLocationSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/contacts", async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contacts", async (req, res) => {
    const parsed = insertEmergencyContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const contact = await storage.createContact(parsed.data);
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    const parsed = insertEmergencyContactSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const contact = await storage.updateContact(Number(req.params.id), parsed.data);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    await storage.deleteContact(Number(req.params.id));
    res.json({ ok: true });
  });

  app.get("/api/alert-settings", async (_req, res) => {
    const settings = await storage.getAlertSettings();
    res.json(settings);
  });

  app.post("/api/alert-settings", async (req, res) => {
    const parsed = insertAlertSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const setting = await storage.createAlertSetting(parsed.data);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/alert-settings/:id", async (req, res) => {
    const parsed = insertAlertSettingsSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const setting = await storage.updateAlertSetting(Number(req.params.id), parsed.data);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/preferences", async (_req, res) => {
    const prefs = await storage.getPreferences();
    res.json(prefs);
  });

  app.post("/api/preferences", async (req, res) => {
    const parsed = insertUserPreferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const pref = await storage.createPreference(parsed.data);
      res.json(pref);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/preferences/:id", async (req, res) => {
    const parsed = insertUserPreferencesSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const pref = await storage.updatePreference(Number(req.params.id), parsed.data);
      res.json(pref);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/checkin-timers", async (_req, res) => {
    const timers = await storage.getCheckInTimers();
    res.json(timers);
  });

  app.post("/api/checkin-timers", async (req, res) => {
    const parsed = insertCheckInTimerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const timer = await storage.createCheckInTimer(parsed.data);
      res.json(timer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/checkin-timers/:id", async (req, res) => {
    const parsed = insertCheckInTimerSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const timer = await storage.updateCheckInTimer(Number(req.params.id), parsed.data);
      res.json(timer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/safe-locations", async (_req, res) => {
    const locations = await storage.getSafeLocations();
    res.json(locations);
  });

  app.post("/api/safe-locations", async (req, res) => {
    const parsed = insertSafeLocationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const location = await storage.createSafeLocation(parsed.data);
      res.json(location);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/safe-locations/:id", async (req, res) => {
    const parsed = insertSafeLocationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const location = await storage.updateSafeLocation(Number(req.params.id), parsed.data);
      res.json(location);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/safe-locations/:id", async (req, res) => {
    await storage.deleteSafeLocation(Number(req.params.id));
    res.json({ ok: true });
  });

  return httpServer;
}
