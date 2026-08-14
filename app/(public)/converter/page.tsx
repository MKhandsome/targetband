import { ConverterTool } from "@/components/tools/ConverterTool"

export const metadata = {
  title: 'Raw Score to Band Converter | TargetBand',
  description: 'Instantly convert your IELTS raw listening or reading score into an official band score.',
}

export default function ConverterPage() {
  return <ConverterTool />
}
