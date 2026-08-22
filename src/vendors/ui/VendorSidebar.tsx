import { memo, useCallback } from 'react'
import { GiAnvil, GiFizzingFlask, GiShop } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { setVendorType } from '../../ui/state/uiFunctions'
import { VendorTypes, VendorTypeList } from '../VendorTypes'

const VendorIcons = {
    [VendorTypes.GeneralMerchant]: <GiShop />,
    [VendorTypes.Blacksmith]: <GiAnvil />,
    [VendorTypes.Alchemist]: <GiFizzingFlask />,
}

export const VendorSidebar = memo(function VendorSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Vendors}>
            {VendorTypeList.map((vendorType) => (
                <VendorLink key={vendorType} vendorType={vendorType} />
            ))}
        </SidebarContainer>
    )
})

const VendorLink = memo(function VendorLink({ vendorType }: { vendorType: VendorTypes }) {
    const { t } = useTranslations()
    const selected = useGameStore((state) => state.ui.vendorType === vendorType)
    const onClick = useCallback(() => setVendorType(vendorType), [vendorType])

    return (
        <MyListItem
            text={t[vendorType]}
            collapsedId={CollapsedEnum.Vendors}
            icon={VendorIcons[vendorType]}
            active={selected}
            onClick={onClick}
        />
    )
})
