import { MenuItem } from './MenuItem'
import classes from './sidebar.module.css'
import { UiPages } from './state/UiPages'

export function Sidebar() {
    return (
        <ul className={classes.sidebarList}>
            <MenuItem text="Activities" page={UiPages.Activities} />
            <MenuItem text="Storage" page={UiPages.Storage} />
            <MenuItem text="Woodcutting" page={UiPages.Woodcutting} />
        </ul>
    )
}
