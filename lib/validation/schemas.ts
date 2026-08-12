import { z } from 'zod'

const bandScore = z
  .number()
  .min(0)
  .max(9)
  .refine((v) => (v * 2) % 1 === 0, 'Band score must be in 0.5 increments')

export const scoreEntrySchema = z.object({
  test_date: z.string(),
  test_type: z.enum(['academic', 'general_training', 'practice_mock']),
  listening_band: bandScore,
  reading_band: bandScore,
  writing_band: bandScore,
  speaking_band: bandScore,
  listening_raw: z.number().int().min(0).max(40).optional(),
  reading_raw: z.number().int().min(0).max(40).optional(),
  notes: z.string().max(500).optional(),
})

export const goalSchema = z.object({
  target_overall: bandScore,
  target_listening: bandScore,
  target_reading: bandScore,
  target_writing: bandScore,
  target_speaking: bandScore,
  target_date: z.string().optional(),
})
