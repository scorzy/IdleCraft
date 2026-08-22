import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { VendorTypes, VendorTypeList } from './VendorTypes'

export interface VendorOffer {
    itemId: string
    unitPrice: number
}

type VendorItems = Record<VendorTypes, readonly string[]>
type VendorPriceMultipliers = Record<VendorTypes, number>

const BASE_VENDOR_ITEMS: VendorItems = {
    [VendorTypes.GeneralMerchant]: ['DeadTreeLog'],
    [VendorTypes.Blacksmith]: ['CopperOre'],
    [VendorTypes.Alchemist]: ['GlassFlask', 'RedFlower', 'BlueFlower', 'GreenFlower'],
}

const LOCATION_EXTRA_ITEMS: Record<GameLocations, Partial<VendorItems>> = {
    [GameLocations.StartVillage]: {},
    [GameLocations.WoodVillage]: {
        [VendorTypes.Alchemist]: ['VitalHerb'],
    },
    [GameLocations.CapitalCity]: {
        [VendorTypes.Alchemist]: ['ManaBloom', 'StaminaLeaf', 'BitterRoot'],
    },
    [GameLocations.MountainVillage]: {
        [VendorTypes.Alchemist]: ['HealingFungus', 'HeartCrystalDust'],
    },
    [GameLocations.Test]: {},
}

const LOCATION_PRICE_MULTIPLIERS: Record<GameLocations, VendorPriceMultipliers> = {
    [GameLocations.StartVillage]: {
        [VendorTypes.GeneralMerchant]: 1.35,
        [VendorTypes.Blacksmith]: 1.4,
        [VendorTypes.Alchemist]: 1.35,
    },
    [GameLocations.WoodVillage]: {
        [VendorTypes.GeneralMerchant]: 1.05,
        [VendorTypes.Blacksmith]: 1.5,
        [VendorTypes.Alchemist]: 1.45,
    },
    [GameLocations.CapitalCity]: {
        [VendorTypes.GeneralMerchant]: 1.45,
        [VendorTypes.Blacksmith]: 1.2,
        [VendorTypes.Alchemist]: 1.15,
    },
    [GameLocations.MountainVillage]: {
        [VendorTypes.GeneralMerchant]: 1.55,
        [VendorTypes.Blacksmith]: 1.05,
        [VendorTypes.Alchemist]: 1.4,
    },
    [GameLocations.Test]: {
        [VendorTypes.GeneralMerchant]: 1.25,
        [VendorTypes.Blacksmith]: 1.25,
        [VendorTypes.Alchemist]: 1.25,
    },
}

function makeOffers(location: GameLocations, vendorType: VendorTypes): readonly VendorOffer[] {
    const itemIds = [...BASE_VENDOR_ITEMS[vendorType], ...(LOCATION_EXTRA_ITEMS[location][vendorType] ?? [])]
    const multiplier = LOCATION_PRICE_MULTIPLIERS[location][vendorType]

    return Object.freeze(
        itemIds.map((itemId) => {
            const item = StdItems[itemId]
            if (!item) throw new Error(`Unknown vendor item ${itemId}`)

            return Object.freeze({
                itemId,
                unitPrice: Math.max(item.value, Math.ceil(item.value * multiplier)),
            })
        })
    )
}

export const VendorCatalogs: Record<GameLocations, Record<VendorTypes, readonly VendorOffer[]>> = Object.fromEntries(
    Object.values(GameLocations).map((location) => [
        location,
        Object.fromEntries(VendorTypeList.map((vendorType) => [vendorType, makeOffers(location, vendorType)])),
    ])
) as Record<GameLocations, Record<VendorTypes, readonly VendorOffer[]>>

export function getVendorOffers(location: GameLocations, vendorType: VendorTypes): readonly VendorOffer[] {
    return VendorCatalogs[location][vendorType]
}

export function getVendorOffer(
    location: GameLocations,
    vendorType: VendorTypes,
    itemId: string
): VendorOffer | undefined {
    return getVendorOffers(location, vendorType).find((offer) => offer.itemId === itemId)
}
