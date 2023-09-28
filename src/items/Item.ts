import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
// import { z } from 'zod'

export enum ItemTypes {
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Bar = 'Bar',
    WoodAxe = 'WoodAxe',
}
export interface Item {
    id: string
    nameId: keyof Msg
    icon: Icons
    type: ItemTypes
    value: number
    woodcuttingDamage?: number
    woodcuttingTime?: number
}

// export const ItemSchema = z.object({
//     id: z.string(),
//     nameId: z.string(),
//     icon: z.string(),
//     type: z.nativeEnum(ItemTypes),
//     value: z.number(),
//     woodcuttingDamage: z.number().optional(),
//     woodcuttingTime: z.number().optional(),
// })
// type A = z.infer<typeof ItemSchema>
