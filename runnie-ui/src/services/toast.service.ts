import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

export const notify = (title: string, description: string, icon?: string) => {
    toast({
        icon,
        title,
        description,
    })
  }

export const notifyError = (error: string) => {
  toast({
    title: 'Error',
    description: error,
    variant: 'destructive',
  })
}