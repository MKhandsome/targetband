export interface SkillScores {
  listening: number
  reading: number
  writing: number
  speaking: number
}

/**
 * Rounds a raw average to the nearest valid IELTS band (multiples of 0.5),
 * rounding .25 up to .5 and .75 up to the next whole band (round-half-up).
 */
export function roundToIeltsBand(average: number): number {
  // Multiply by 2 to work in "half-band units", round-half-up, divide back.
  const halfBandUnits = Math.round(average * 2)
  return halfBandUnits / 2
}

export function calculateOverallBand(scores: SkillScores): number {
  const { listening, reading, writing, speaking } = scores
  const values = [listening, reading, writing, speaking]

  values.forEach((v) => {
    if (v < 0 || v > 9) throw new Error('Each band score must be between 0 and 9.')
  })

  const average = values.reduce((sum, v) => sum + v, 0) / 4
  return roundToIeltsBand(average)
}
