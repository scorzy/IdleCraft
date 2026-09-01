import { memo, useCallback } from 'react'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { BattleZones } from '../BattleZones'
import { addBattle } from '../functions/addBattle'
import { selectBattleZone } from '../selectors/selectBattleZone'
import { CombatSidebar } from './CombatSidebar'
import { EnemyInfoUi } from './EnemyInfoUi'
import classes from './battleZone.module.css'

export const CombatPage = memo(function CombatPage() {
    const battleZoneEnum = useGameStore(selectBattleZone)

    return (
        <MyPageAll sidebar={<CombatSidebar />}>
            <MyPage className={classes.areaCards} key={battleZoneEnum}>
                {battleZoneEnum && <BattleZoneInfoUi battleZoneEnum={battleZoneEnum} />}
            </MyPage>
        </MyPageAll>
    )
})

const BattleZoneInfoUi = memo(function BattleZoneInfoUi({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()
    const battleZone = BattleZones[battleZoneEnum]

    return (
        <>
            <Card>
                <MyCardHeaderTitle
                    title={t[battleZone.nameId]}
                    icon={IconsData[battleZone.iconId]}
                    rightSlot={<AddBattleButton battleZoneEnum={battleZoneEnum} />}
                />
            </Card>
            {battleZone.enemies.map((enemy) => (
                <Card key={enemy.id}>
                    <EnemyInfoUi quantity={enemy.quantity} templateEnum={enemy.template} />
                </Card>
            ))}
        </>
    )
})

const AddBattleButton = memo(function AddBattleButton({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()
    const onAddClick = useCallback(() => addBattle(battleZoneEnum), [battleZoneEnum])
    const battleZone = BattleZones[battleZoneEnum]

    return (
        <AddActivityDialog
            addBtn={<Button onClick={onAddClick}>{t.Fight}</Button>}
            title={
                <>
                    {IconsData[battleZone.iconId]} {t[battleZone.nameId]}
                </>
            }
            openBtn={<Button>{t.Fight}</Button>}
        />
    )
})
