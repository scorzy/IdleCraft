import { LuSun, LuMoon } from 'react-icons/lu'
import { memo } from 'react'
import { setTheme, setThemeColor } from './state/uiFunctions'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const ModeToggle = memo(function ModeToggle() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setThemeColor('')}>Zinc</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeColor('blue')}>Blue</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeColor('green')}>Green</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
