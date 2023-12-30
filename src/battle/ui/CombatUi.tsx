import { memo } from 'react'
import { MyPage } from '../../ui/pages/MyPage'
import { MyCard } from '../../ui/myCard/myCard'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { BattleAreasList } from '../battleAreas'
import { useTranslations } from '../../msg/useTranslations'
import { IconsData } from '../../icons/Icons'

export const CombatPage = memo(function CombatPage() {
    return (
        <MyPage>
            <CombatAreas />
        </MyPage>
    )
})
export const CombatAreas = memo(function CombatAreas() {
    const { t } = useTranslations()
    return (
        <MyPage>
            <MyCard title="Combat Zones">
                {BattleAreasList.map((b) => {
                    return (
                        <MyListItem
                            key={b.id}
                            collapsed={false}
                            active={false}
                            text={t[b.nameId]}
                            icon={IconsData[b.iconId]}
                        />
                    )
                })}
            </MyCard>
        </MyPage>
    )
})
