import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(3, "Please enter an email or WhatsApp number.")
    .max(160, "That value is too long.")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^\+?[\d\s()-]{7,20}$/.test(value),
      "Enter a valid email address or phone number.",
    ),
  projectType: z
    .string()
    .trim()
    .min(2, "Please choose a project type.")
    .max(60),
  budget: z.string().trim().min(2, "Please choose a budget range.").max(60),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (20 characters minimum).")
    .max(4000, "Please keep the brief under 4000 characters."),
  locale: z.enum(["en", "ur"]).default("en"),
  // Honeypot — real users never fill this in.
  company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const arcadeScoreSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "Nickname is too short.")
    .max(18, "Nickname is too long.")
    .regex(/^[\p{L}\p{N} _.-]+$/u, "Nickname contains invalid characters."),
  score: z.number().int().min(0).max(9_999_999),
  cores: z.number().int().min(0).max(999_999).default(0),
  durationSec: z.number().int().min(0).max(86_400).default(0),
  locale: z.enum(["en", "ur"]).default("en"),
});
