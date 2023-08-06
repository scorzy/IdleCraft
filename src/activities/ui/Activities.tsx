import { memo } from 'react'
import { useGameStore } from '../../game/state'
import { selectActivityIcon, selectActivityId, selectActivityTitle } from '../ActivitySelectors'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import { Page } from '../../ui/shell/AppShell'
import { MyCard } from '../../ui/myCard/myCard'
import IconButton from '@mui/material/IconButton'
import { TbArrowDown, TbArrowUp, TbTrash } from 'react-icons/tb'
import { moveActivityNext, moveActivityPrev, removeActivity } from '../activityFunctions'
import classes from './activities.module.css'
import { Chip, Divider } from '@mui/material'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'

export const Activities = memo(function Activities() {
    const ids = useGameStore(selectActivityId)
    const max = ids.length - 1
    return (
        <Page>
            <div className="my-container">
                <MyCard>
                    <List dense disablePadding>
                        {ids.map((i, index) => (
                            <ActivityCard id={i} key={i} isFirst={index === 0} isLast={index >= max} />
                        ))}
                    </List>
                </MyCard>
            </div>
        </Page>
    )
})

export const ActivityCard = memo(function ActivityCard(props: { id: string; isFirst: boolean; isLast: boolean }) {
    const { id, isFirst, isLast } = props
    const act = useGameStore((s) => s.activities.entries[id])
    const title = useGameStore(selectActivityTitle(id))
    const icon = useGameStore(selectActivityIcon(id))
    const active = useGameStore((s) => s.activityId === id)
    const { t } = useTranslations()
    const cur = useGameStore((s) => (active ? s.activityDone + 1 : 0))
    const { f } = useNumberFormatter()

    if (act === undefined) return <></>

    return (
        <>
            <ListItem
                secondaryAction={
                    <>
                        {!isFirst && (
                            <IconButton aria-label={t.MoveUp} onClick={() => moveActivityPrev(id)}>
                                <TbArrowUp />
                            </IconButton>
                        )}
                        {!isLast && (
                            <IconButton aria-label={t.MoveDown} onClick={() => moveActivityNext(id)}>
                                <TbArrowDown />
                            </IconButton>
                        )}
                        <IconButton aria-label={t.Remove} color="error" onClick={() => removeActivity(id)}>
                            <TbTrash />
                        </IconButton>
                    </>
                }
            >
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                <ListItemText
                    disableTypography
                    primary={<div>{title}</div>}
                    secondary={
                        <Chip
                            label={
                                <>
                                    {active ? 'Active' : 'In Queue'}{' '}
                                    <span className="monospace">
                                        {f(cur)}/{f(act.max)}
                                    </span>
                                </>
                            }
                            color={active ? 'primary' : 'default'}
                            size="small"
                        />
                    }
                />
            </ListItem>
            {!isLast && <Divider />}
        </>
    )
})
