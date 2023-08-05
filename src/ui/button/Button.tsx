import { ReactNode, memo } from 'react'
import { Colors } from '../state/uiFunctions'
import Button from '@mui/material/Button'

export const MyButton = memo(
    (props: {
        text: string
        startIcon?: ReactNode
        onClick?: () => void
        color?: Colors
        className?: string
        variant?: 'text' | 'outlined' | 'contained'
        disabled?: boolean
        size?: 'small' | 'medium' | 'large'
    }) => {
        const { text, onClick, color, startIcon, className, variant, disabled, size } = props
        return (
            <Button
                onClick={onClick}
                variant={variant}
                startIcon={startIcon}
                className={className}
                color={color}
                disabled={disabled}
                size={size}
            >
                {text}
            </Button>
        )
    }
)
MyButton.displayName = 'MyButton'
