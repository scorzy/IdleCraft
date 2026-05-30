import { memo, useCallback, useMemo } from 'react'
import { Button } from '../../components/ui/button'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { GameLocationDataMap, GameLocations } from '../GameLocations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { IconsData } from '../../icons/Icons'
import { travel } from '../functions/travel'
import { setSelectedLocation } from '../../ui/state/uiFunctions'
import { selectSelectedGameLocation } from '../../ui/state/uiSelectors'
import { Card, CardContent, CardFooter } from '../../components/ui/card'

export const World = memo(function World() {
    const locations = useMemo(() => Object.values(GameLocations).toSorted() as GameLocations[], [])

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
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button disabled={isCurrentLocation} onClick={onTravel} className="mt-4">
                    {t.Travel}
                </Button>
            </CardFooter>
        </Card>
    )
})
