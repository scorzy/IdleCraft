import { ReactNode, memo } from 'react'

export const Title = memo((props: { text: string; icon?: ReactNode }) => {
    const { text, icon } = props
    return (
        <h2>
            {icon} {text}
        </h2>
    )
})
Title.displayName = 'Title'
