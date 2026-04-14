import { z } from "zod"

/** Default to "" so external JSON without ids still parses; backfillIds() fills them in. */
const itemId = z.string().default("")

const periodSchema = z.object({
  start: z.string(),
  end: z.string().nullable().default(null),
  current: z.boolean().default(false),
})

export const experienceItemSchema = z.object({
  id: itemId,
  title: z.string(),
  company: z.string(),
  location: z.string(),
  period: periodSchema,
  description: z.array(z.string()),
})

const educationPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
})

const addressSchema = z.object({
  street: z.string(),
  plz: z.string(),
  city: z.string(),
})

export const educationItemSchema = z.object({
  id: itemId,
  degree: z.string(),
  institution: z.string(),
  location: z.string().default(""),
  period: educationPeriodSchema,
  thesis: z.string().default(""),
  grade: z.string().default(""),
})

export const cvSchema = z
  .object({
    personal_info: z.object({
      name: z.string(),
      date_of_birth: z.string().default(""),
      place_of_birth: z.string().default(""),
      nationality: z.string().default(""),
      marital_status: z.string().default(""),
      driving_license: z.string().default(""),
      address: addressSchema.default({ street: "", plz: "", city: "" }),
      phone: z.string().default(""),
      email: z.string().default(""),
      website: z.string().default(""),
      linkedin: z.string().default(""),
      xing: z.string().default(""),
    }),
    summary: z.string().default(""),
    experience: z.array(experienceItemSchema).default([]),
    education: z.array(educationItemSchema).default([]),
    certifications: z.array(z.string()).default([]),
    skills: z.array(
      z.object({
        id: itemId,
        category: z.string(),
        items: z.array(z.string()),
      }),
    ).default([]),
    projects: z.array(
      z.object({
        id: itemId,
        name: z.string(),
        url: z.string().default(""),
        description: z.string().default(""),
        tech_stack: z.array(z.string()).default([]),
      }),
    ).default([]),
    languages: z.array(
      z.object({
        id: itemId,
        language: z.string(),
        level: z.string().default(""),
        cefr: z.string().nullable().default(null),
      }),
    ).default([]),
    volunteer: z.array(
      z.object({
        id: itemId,
        role: z.string(),
        organization: z.string().default(""),
        period: periodSchema,
        description: z.string().default(""),
      }),
    ).default([]),
    interests: z.array(z.string()).default([]),
    signature: z
      .object({
        city: z.string(),
        date: z.string(),
        image: z.string().default(""),
      })
      .nullable()
      .default(null),
  })
  .superRefine((data, ctx) => {
    data.experience.forEach((ex, i) => {
      if (ex.period.current && ex.period.end !== null) {
        ctx.addIssue({
          code: "custom",
          message: "When current is true, end must be null",
          path: ["experience", i, "period", "end"],
        })
      }
    })
  })

export type CvData = z.infer<typeof cvSchema>
