import { memoize } from 'proxy-memoize'
import { memo, useCallback, useMemo } from 'react'
import { Button } from '../../components/ui/button'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { GameState } from '../../game/GameState'
import { useTranslations } from '../../msg/useTranslations'
import { GameLocationDataMap, GameLocations } from '../GameLocations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyLabel, MyLabelContainer } from '../../ui/myCard/MyLabel'
import { IconsData } from '../../icons/Icons'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { travel } from '../functions/travel'
import { setSelectedLocation } from '../../ui/state/uiFunctions'
import { selectSelectedGameLocation } from '../../ui/state/uiSelectors'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { selectGameLocationIds } from '../GameLocationSelectors'
import { LocationModifierType } from '../modifiers/LocationModifier'
import { LocationModifierDataMap } from '../modifiers/LocationModifierData'
import { selectLocationModifierBonusResult, selectLocationModifierMulti } from '../modifiers/locationModifierSelectors'

export const World = memo(function World() {
    const locations = useGameStore(selectGameLocationIds)

    return (
        <MyPageAll
            sidebar={
                <SidebarContainer collapsedId={CollapsedEnum.World}>
                    {locations.map((location) => (
                        <LocationLink key={location} location={location} />
                    ))}
                </SidebarContainer>
            }
        >
            <MyPage className="page__main">
                <Location />
            </MyPage>
        </MyPageAll>
    )
})

export const LocationLink = memo(function LocationLink({ location }: { location: GameLocations }) {
    const { t } = useTranslations()
    const selectedLocation = useGameStore(selectSelectedGameLocation)
    const locationData = GameLocationDataMap[location]
    const isCurrentLocation = selectedLocation === location

    const onLocationClick = useCallback(() => {
        if (isCurrentLocation) return
        setSelectedLocation(location)
    }, [isCurrentLocation, location])

    return (
        <MyListItem
            key={location}
            text={t[locationData.name]}
            icon={IconsData[locationData.icon]}
            active={location === selectedLocation}
            onClick={onLocationClick}
            collapsedId={CollapsedEnum.World}
        />
    )
})

export const Location = memo(function Location() {
    const { t } = useTranslations()
    const loc = useGameStore(selectSelectedGameLocation)
    const selectedLocationData = GameLocationDataMap[loc]
    const isCurrentLocation = useGameStore(useCallback((s) => s.location === loc, [loc]))

    const onTravel = useCallback(() => {
        if (isCurrentLocation) return
        travel(loc)
    }, [isCurrentLocation, loc])

    return (
        <Card>
            <MyCardHeaderTitle title={t[selectedLocationData.name]} icon={IconsData[selectedLocationData.icon]} />
            <CardContent>
                <p className="mt-2 text-sm">{t[selectedLocationData.description]}</p>
                <LocationModifiers location={loc} />
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button disabled={isCurrentLocation} onClick={onTravel} className="mt-4">
                    {t.Travel}
                </Button>
            </CardFooter>
        </Card>
    )
})

const LocationModifierRow = memo(function LocationModifierRow(props: {
    location: GameLocations
    type: LocationModifierType
}) {
    const { location, type } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const data = LocationModifierDataMap[type]

    const multi = useGameStore(
        useCallback((s: GameState) => selectLocationModifierMulti(s, location, type), [location, type])
    )
    const selectBonusResultMemo = useMemo(
        () => memoize((s: GameState) => selectLocationModifierBonusResult(s, location, type)),
        [location, type]
    )

    if (!multi) return null

    return (
        <MyLabel>
            {IconsData[data.iconId]} {t[data.descriptionId]} +{f(multi)}%
            <BonusDialog title={t[data.nameId]} selectBonusResult={selectBonusResultMemo} />
        </MyLabel>
    )
})

const LocationModifiers = memo(function LocationModifiers({ location }: { location: GameLocations }) {
    return (
        <MyLabelContainer className="mt-2">
            {Object.values(LocationModifierType).map((type) => (
                <LocationModifierRow key={type} location={location} type={type} />
            ))}
        </MyLabelContainer>
    )
})
