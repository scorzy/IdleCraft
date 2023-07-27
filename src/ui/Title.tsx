import Typography from '@mui/joy/Typography'
import { ReactNode, memo } from 'react'

export const Title = memo((props: { text: string; icon?: ReactNode }) => {
    const { text, icon } = props
    return (
        <Typography level="h2" startDecorator={icon} sx={{ marginBottom: 1 }}>
            {text}
        </Typography>
    )
})
Title.displayName = 'Title'
