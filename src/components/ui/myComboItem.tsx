import { ReactNode, memo } from 'react'

export const MyComboItem = memo(function MyComboItem(props: { icon?: ReactNode; title: string }) {
    const { icon, title } = props

    return (
        <>
            {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
            {title}
        </>
    )
})
