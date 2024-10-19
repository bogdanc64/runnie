import { helpers } from '@vuelidate/validators'
import type { ComputedRef } from 'vue'

export const createThresholdValidator = (
    threshold: number,
    message: string,
    scoreRef: ComputedRef<number>
  ) => {
    return helpers.withMessage(
      message,
      () => {
        const score = scoreRef.value
        return score >= threshold
      }
    )
  }