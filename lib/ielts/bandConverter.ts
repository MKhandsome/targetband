export interface BandThreshold {
  minRaw: number // inclusive
  band: number
}

export const READING_ACADEMIC_TABLE: BandThreshold[] = [
  { minRaw: 39, band: 9.0 },
  { minRaw: 37, band: 8.5 },
  { minRaw: 35, band: 8.0 },
  { minRaw: 33, band: 7.5 },
  { minRaw: 30, band: 7.0 },
  { minRaw: 27, band: 6.5 },
  { minRaw: 23, band: 6.0 },
  { minRaw: 19, band: 5.5 },
  { minRaw: 15, band: 5.0 },
  { minRaw: 13, band: 4.5 },
  { minRaw: 10, band: 4.0 },
  { minRaw: 8, band: 3.5 },
  { minRaw: 6, band: 3.0 },
  { minRaw: 4, band: 2.5 },
  { minRaw: 0, band: 0.0 },
]

export const READING_GENERAL_TABLE: BandThreshold[] = [
  { minRaw: 40, band: 9.0 },
  { minRaw: 39, band: 8.5 },
  { minRaw: 37, band: 8.0 },
  { minRaw: 36, band: 7.5 },
  { minRaw: 34, band: 7.0 },
  { minRaw: 32, band: 6.5 },
  { minRaw: 30, band: 6.0 },
  { minRaw: 27, band: 5.5 },
  { minRaw: 23, band: 5.0 },
  { minRaw: 19, band: 4.5 },
  { minRaw: 15, band: 4.0 },
  { minRaw: 12, band: 3.5 },
  { minRaw: 0, band: 0.0 },
]

export const LISTENING_TABLE: BandThreshold[] = [
  { minRaw: 39, band: 9.0 },
  { minRaw: 37, band: 8.5 },
  { minRaw: 35, band: 8.0 },
  { minRaw: 32, band: 7.5 },
  { minRaw: 30, band: 7.0 },
  { minRaw: 26, band: 6.5 },
  { minRaw: 23, band: 6.0 },
  { minRaw: 18, band: 5.5 },
  { minRaw: 16, band: 5.0 },
  { minRaw: 13, band: 4.5 },
  { minRaw: 10, band: 4.0 },
  { minRaw: 8, band: 3.5 },
  { minRaw: 0, band: 0.0 },
]

export function rawScoreToBand(
  rawScore: number,
  table: BandThreshold[]
): number {
  if (rawScore < 0 || rawScore > 40) {
    throw new Error('Raw score must be between 0 and 40.')
  }
  const sorted = [...table].sort((a, b) => b.minRaw - a.minRaw)
  const match = sorted.find((row) => rawScore >= row.minRaw)
  return match ? match.band : 0
}
