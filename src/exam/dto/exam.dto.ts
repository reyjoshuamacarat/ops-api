import { Exam } from '@prisma/client'

export interface ExtendedExamDto extends Exam {
  countTakers: number
  countActivity: number
}
