import { Item } from '../items/Item'
import { Icons } from '../icons/Icons'

export const WoodItems: { [k: string]: Item } = {
    DeadTreeLog: {
        id: 'DeadTreeLog',
        icon: Icons.Log,
        nameId: 'DeadTreeLog',
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'OakLog',
    },
}
