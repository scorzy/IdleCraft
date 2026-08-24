import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { VendorTypes, VendorTypeList } from './VendorTypes'

export interface VendorOffer {
    itemId: string
    unitPrice: number
}

export interface VendorPurchaseOption extends VendorOffer {
    vendorType: VendorTypes
}

export interface VendorItemData {
    itemId: string
    multiplier?: number
}

export interface VendorData {
    vendorType: VendorTypes
    items: VendorItemData[]
    multiplier: number
}

export const VENDOR_DATA: Record<GameLocations, VendorData[]> = {
    [GameLocations.StartVillage]: [
        {
            vendorType: VendorTypes.GeneralMerchant,
            items: [{ itemId: 'DeadTreeLog' }],
            multiplier: 2.5,
        },
        {
            vendorType: VendorTypes.Blacksmith,
            items: [{ itemId: 'CopperOre', multiplier: 1.5 }],
            multiplier: 3,
        },
        {
            vendorType: VendorTypes.Alchemist,
            items: [
                { itemId: 'GlassFlask', multiplier: 1.25 },
                { itemId: 'RedFlower' },
                { itemId: 'BlueFlower' },
                { itemId: 'GreenFlower' },
            ],
            multiplier: 2.5,
        },
    ],
    [GameLocations.WoodVillage]: [
        {
            vendorType: VendorTypes.GeneralMerchant,
            items: [{ itemId: 'DeadTreeLog' }],
            multiplier: 2,
        },
        {
            vendorType: VendorTypes.Blacksmith,
            items: [{ itemId: 'CopperOre', multiplier: 1.75 }],
            multiplier: 3.5,
        },
        {
            vendorType: VendorTypes.Alchemist,
            items: [
                { itemId: 'GlassFlask', multiplier: 1.25 },
                { itemId: 'RedFlower' },
                { itemId: 'BlueFlower' },
                { itemId: 'GreenFlower' },
                { itemId: 'VitalHerb' },
            ],
            multiplier: 2,
        },
    ],
    [GameLocations.CapitalCity]: [
        {
            vendorType: VendorTypes.GeneralMerchant,
            items: [{ itemId: 'DeadTreeLog', multiplier: 1.5 }],
            multiplier: 3,
        },
        {
            vendorType: VendorTypes.Blacksmith,
            items: [{ itemId: 'CopperOre', multiplier: 1.25 }],
            multiplier: 2.5,
        },
        {
            vendorType: VendorTypes.Alchemist,
            items: [
                { itemId: 'GlassFlask' },
                { itemId: 'RedFlower', multiplier: 1.25 },
                { itemId: 'BlueFlower', multiplier: 1.25 },
                { itemId: 'GreenFlower', multiplier: 1.25 },
                { itemId: 'ManaBloom', multiplier: 1.25 },
                { itemId: 'StaminaLeaf', multiplier: 1.25 },
                { itemId: 'BitterRoot', multiplier: 1.25 },
            ],
            multiplier: 2.25,
        },
    ],
    [GameLocations.MountainVillage]: [
        {
            vendorType: VendorTypes.GeneralMerchant,
            items: [{ itemId: 'DeadTreeLog', multiplier: 2 }],
            multiplier: 4,
        },
        {
            vendorType: VendorTypes.Blacksmith,
            items: [{ itemId: 'CopperOre' }],
            multiplier: 2,
        },
        {
            vendorType: VendorTypes.Alchemist,
            items: [
                { itemId: 'GlassFlask', multiplier: 1.5 },
                { itemId: 'RedFlower', multiplier: 1.5 },
                { itemId: 'BlueFlower', multiplier: 1.5 },
                { itemId: 'GreenFlower', multiplier: 1.5 },
                { itemId: 'HealingFungus' },
                { itemId: 'HeartCrystalDust' },
            ],
            multiplier: 2.5,
        },
    ],
    [GameLocations.Test]: [
        {
            vendorType: VendorTypes.GeneralMerchant,
            items: [{ itemId: 'DeadTreeLog' }],
            multiplier: 2,
        },
        {
            vendorType: VendorTypes.Blacksmith,
            items: [{ itemId: 'CopperOre' }],
            multiplier: 2,
        },
        {
            vendorType: VendorTypes.Alchemist,
            items: [
                { itemId: 'GlassFlask' },
                { itemId: 'RedFlower' },
                { itemId: 'BlueFlower' },
                { itemId: 'GreenFlower' },
            ],
            multiplier: 2,
        },
    ],
}

function makeOffers(location: GameLocations, vendorType: VendorTypes): readonly VendorOffer[] {
    const vendor = VENDOR_DATA[location].find((data) => data.vendorType === vendorType)
    if (!vendor) throw new Error(`Missing ${vendorType} data for ${location}`)

    return Object.freeze(
        vendor.items.map(({ itemId, multiplier = 1 }) => {
            const item = StdItems[itemId]
            if (!item) throw new Error(`Unknown vendor item ${itemId}`)

            return Object.freeze({
                itemId,
                unitPrice: Math.max(item.value, Math.ceil(item.value * vendor.multiplier * multiplier)),
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

export function getVendorPurchaseOption(location: GameLocations, itemId: string): VendorPurchaseOption | undefined {
    return getVendorPurchaseOptions(location).find((option) => option.itemId === itemId)
}

export function getVendorPurchaseOptions(location: GameLocations): VendorPurchaseOption[] {
    const result = new Map<string, VendorPurchaseOption>()

    for (const vendorType of VendorTypeList) {
        for (const offer of getVendorOffers(location, vendorType)) {
            const current = result.get(offer.itemId)
            if (!current || offer.unitPrice < current.unitPrice) result.set(offer.itemId, { ...offer, vendorType })
        }
    }

    return [...result.values()]
}
