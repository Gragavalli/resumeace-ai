import { type ResumeData, type TemplateId } from '../types/resume'
import { ModernTemplate, ClassicTemplate, MinimalTemplate, CompactTemplate } from './ResumeTemplates'

interface Props {
  data: ResumeData
  template: TemplateId
}

export default function ResumePreview({ data, template }: Props) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} />
    case 'minimal':
      return <MinimalTemplate data={data} />
    case 'compact':
      return <CompactTemplate data={data} />
    case 'modern':
    default:
      return <ModernTemplate data={data} />
  }
}
