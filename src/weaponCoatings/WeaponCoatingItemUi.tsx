import { memo, useCallback } from 'react'
import { PLAYER_ID } from '../characters/charactersConst'
import { getCharacterSelector } from '../characters/getCharacterSelector'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter } from '../components/ui/card'
import { useGameStore } from '../game/state'
import { useTranslations } from '../msg/useTranslations'
import { getSelectedItem, getSelectedItemQta } from '../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../ui/myCard/MyCard'
import {
    applyWeaponCoatingClick,
    getWeaponCoatingEffectiveness,
    scaleWeaponCoatingValue,
} from './weaponCoatingFunctions'

export const WeaponCoatingItemUi = memo(function WeaponCoatingItemUi() {
    const quantity = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const weapon = useGameStore((state) => getCharacterSelector(PLAYER_ID).MainWeapon(state))
    const { t } = useTranslations()
    const itemId = item?.id
    const onApply = useCallback(() => {
        if (itemId) applyWeaponCoatingClick(PLAYER_ID, itemId)
    }, [itemId])

    if (quantity <= 0 || !item?.weaponCoatingData) return null

    const coating = item.weaponCoatingData
    const effectiveness = getWeaponCoatingEffectiveness(weapon)

    return (
        <Card>
            <MyCardHeaderTitle title={t.WeaponCoating} />
            <CardContent>
                <div>
                    {t.CoatingCharges}: {coating.charges}
                </div>
                <div>
                    {t.CoatingEffectiveness}: {effectiveness / 100}%
                </div>
                {coating.effects.map((effect) => (
                    <div key={effect.effect}>
                        {t.DamagePerSec}: {scaleWeaponCoatingValue(effect.value, effectiveness)}
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={onApply} disabled={!weapon}>
                    {t.ApplyCoating}
                </Button>
                {!weapon && <span className="text-muted-foreground">{t.NoWeaponToCoat}</span>}
            </CardFooter>
        </Card>
    )
})
