import { Item } from './Item'
import { PRIMARY_MATERIAL_KEY } from './itemsConst'
import { Material, MaterialsData } from './materials/materials'

export function selectPrimaryMaterial(item: Item): Material | undefined {
    const primary = item.materials?.[PRIMARY_MATERIAL_KEY]
    if (primary) return MaterialsData[primary]
}
