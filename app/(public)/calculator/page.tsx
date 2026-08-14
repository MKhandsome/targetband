import { CalculatorTool } from '@/components/tools/CalculatorTool'

export const metadata = {
  title: 'Overall Band Calculator | TargetBand',
  description: 'Input your 4 section scores and calculate your official rounded overall IELTS band.',
}

export default function CalculatorPage() {
  return <CalculatorTool />
}
