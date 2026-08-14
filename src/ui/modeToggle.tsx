import { memo } from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from '@/msg/useTranslations'
import { setTheme, setThemeColor } from './state/uiFunctions'

export const ModeToggle = memo(function ModeToggle() {
    const { t } = useTranslations()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="icon">
                        <LuSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <LuMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">{t.ToggleTheme}</span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>{t.ThemeLight}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>{t.ThemeDark}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>{t.ThemeSystem}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setThemeColor('')}>{t.ThemeZinc}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeColor('blue')}>{t.ThemeBlue}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeColor('green')}>{t.ThemeGreen}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeColor('violet')}>{t.ThemeViolet}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
