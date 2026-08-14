import { GapCalculatorTool } from '@/components/tools/GapCalculatorTool'

export const metadata = {
  title: 'Target Gap Calculator | TargetBand',
  description: 'Input your 3 known scores and target overall band to find out what you need in your weakest skill.',
}

export default function GapCalculatorPage() {
  return <GapCalculatorTool />
}
