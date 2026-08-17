import { memo, useCallback, useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
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
import { travel } from '../functions/travel'
import { setSelectedLocation } from '../../ui/state/uiFunctions'
import { selectSelectedGameLocation, selectTravelling } from '../../ui/state/uiSelectors'
import { useUiTempStore } from '../../ui/state/uiTempStore'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { selectGameLocationIds } from '../GameLocationSelectors'
import { LocationModifierType } from '../modifiers/LocationModifier'
import { LocationModifierDataMap } from '../modifiers/LocationModifierData'
import { selectLocationModifierMulti } from '../modifiers/locationModifierSelectors'

export const World = memo(function World() {
    const locations = useGameStore(selectGameLocationIds)

    return (
        <MyPageAll
            sidebar={
                <SidebarContainer collapsedId={CollapsedEnum.World}>
                    {locations.map(
                        (location) =>
                            location !== GameLocations.Test && <LocationLink key={location} location={location} />
                    )}
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
    const travelling = useUiTempStore(selectTravelling)

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
                {travelling ? (
                    travelling.location === loc ? (
                        <TravelProgress start={travelling.start} end={travelling.end} />
                    ) : (
                        <Button disabled className="mt-4">
                            {t.Travel}
                        </Button>
                    )
                ) : (
                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button disabled={isCurrentLocation} className="mt-4">
                                    {t.Travel}
                                </Button>
                            }
                        />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.travelConfirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>{t.travelConfirmDesc}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={onTravel}>{t.Travel}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardFooter>
        </Card>
    )
})

const TravelProgress = memo(function TravelProgress(props: { start: number; end: number }) {
    const { start, end } = props
    const { t } = useTranslations()
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [])

    const value = Math.min(100, Math.max(0, (100 * (now - start)) / (end - start)))

    return (
        <div className="mt-4 flex w-full flex-col gap-2">
            <span className="text-sm">{t.Travelling}</span>
            <ProgressBar value={value} color="primary" />
        </div>
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

    if (!multi) return null
    const suffix = data.percentage === false ? '' : '%'

    return (
        <MyLabel>
            {IconsData[data.iconId]} {t[data.descriptionId]} {multi > 0 ? '+' : ''}
            {f(multi)}
            {suffix}
        </MyLabel>
    )
})
