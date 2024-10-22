import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

export const notify = (title: string, description: string, icon?: string) => {
  toast({
      icon,
      title,
      description,
  })
}

export const notifySuccess = (message: string) => {
  toast({
    title: 'Success',
    description: message,
    icon: "mdi:success-circle"
  })
}

export const notifyError = (error: string) => {
  toast({
    icon: "mdi:alert-circle",
    title: 'Error',
    description: error,
    variant: 'destructive',
  })
}