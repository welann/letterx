export interface Attachment {
    id: string
    name: string
    type: string
    url: string
    size: number
}

export interface Letter {
    id: string
    subject: string
    content: string
    deliveryDate: Date
    isPublic: boolean
    attachments: Attachment[]
}


interface ComposeFormData {
    subject: string
    content: string
    attachments: Attachment[]
}

export interface ComposeFormProps {
    initialData: ComposeFormData
    onComplete: (data: ComposeFormData) => void
}


export interface DeliverySettingsType {
    deliveryTime: string
    customDate: Date | null
    visibility: 'private' | 'public'
    recipients: string[]
    subscription: string
}

export interface DeliverySettingsProps {
    initialSettings: DeliverySettingsType
    onSettingsChange: (settings: DeliverySettingsType) => void
    onBack: () => void
    onSend: () => void
}

export interface LetterAttachmentsProps {
    attachments: Attachment[]
    fullSize?: boolean
}


export interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

