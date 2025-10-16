import { PRIMARY_MATERIAL_KEY } from '../../items/itemsConst'
import { MaterialsData } from '../../items/materials/materials'
import { Msg } from '../Msg'
import { ItemsMaterials } from '@/items/materials/ItemsMaterials'

export function selectPrimaryMaterialName(materials: ItemsMaterials): keyof Msg | undefined {
    const primary = materials[PRIMARY_MATERIAL_KEY]
    if (primary) {
        const data = MaterialsData[primary]
        if (data) return data.nameId
    }

    return
}
