import { roundToIeltsBand } from './overallScoreCalculator'

export interface GapCalculatorInput {
  knownScores: [number, number, number] // 3 known skill scores
  targetOverall: number
}

export interface GapCalculatorResult {
  requiredScore: number | null // null if unreachable even at 9.0
  isAchievable: boolean
}

const VALID_BAND_STEPS: number[] = Array.from({ length: 19 }, (_, i) => i * 0.5) // 0..9

/**
 * Finds the minimum band score needed in the 4th (unknown) skill so the
 * rounded overall meets or exceeds the target, by testing every valid
 * 0.5-increment band value from 0 to 9.
 */
export function calculateRequiredScore(
  input: GapCalculatorInput
): GapCalculatorResult {
  const { knownScores, targetOverall } = input
  const sumKnown = knownScores.reduce((a, b) => a + b, 0)

  for (const candidate of VALID_BAND_STEPS) {
    const average = (sumKnown + candidate) / 4
    const overall = roundToIeltsBand(average)
    if (overall >= targetOverall) {
      return { requiredScore: candidate, isAchievable: true }
    }
  }

  return { requiredScore: null, isAchievable: false }
}
