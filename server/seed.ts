import { db } from "./db";
import { emergencyContacts, alertSettings, userPreferences, safeLocations } from "@shared/schema";

export async function seedDatabase() {
  const existingContacts = await db.select().from(emergencyContacts);
  if (existingContacts.length > 0) return;

  await db.insert(emergencyContacts).values([
    { name: "Sarah Mitchell", phone: "+64 21 555 0101", level: 1, relationship: "Sister" },
    { name: "Emergency Services", phone: "111", level: 1, relationship: "Emergency" },
    { name: "David Chen", phone: "+64 21 555 0202", level: 2, relationship: "Best Friend" },
    { name: "Rachel Torres", phone: "+64 21 555 0303", level: 2, relationship: "Colleague" },
    { name: "Mark Johnson", phone: "+64 21 555 0404", level: 3, relationship: "Neighbor" },
  ]);

  await db.insert(alertSettings).values([
    {
      level: 1,
      activationPhrase: "Help me now",
      messageTemplate: "EMERGENCY ALERT: I need immediate help. This is an automated message from Sentinel Dynamic. Please call emergency services.",
      includeLocation: true,
      countryEmergencyNumber: "111",
    },
    {
      level: 2,
      activationPhrase: "I need help",
      messageTemplate: "ALERT: I may be in danger. Please check on me. This is an automated message from Sentinel Dynamic.",
      includeLocation: true,
    },
    {
      level: 3,
      activationPhrase: "Send message",
      messageTemplate: "NOTICE: I wanted you to know my current location. This is an automated message from Sentinel Dynamic.",
      includeLocation: true,
    },
  ]);

  await db.insert(userPreferences).values([
    { language: "en", systemArmed: false, voiceSensitivity: 0.7, decoyMode: true },
  ]);

  await db.insert(safeLocations).values([
    { name: "Home", address: "42 Sentinel Avenue, Wellington", latitude: -41.2865, longitude: 174.7762, radiusMeters: 100, autoDisarm: true },
    { name: "Work", address: "15 Lambton Quay, Wellington", latitude: -41.2794, longitude: 174.7769, radiusMeters: 150, autoDisarm: true },
  ]);

  console.log("Database seeded with initial data");
}
