import { MenuItem } from './MenuItem'
import classes from './sidebar.module.css'

export function Sidebar() {
    return (
        <ul className={classes.sidebarList}>
            <MenuItem text="Activities" />
            <MenuItem text="Storage" active={true} />
            <MenuItem text="Woodcutting" />
        </ul>
    )
}
