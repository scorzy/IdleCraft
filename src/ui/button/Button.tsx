import { ReactNode } from 'react'
import { Colors } from '../state/uiFunctions'

export function Button(props: { text?: string; children?: ReactNode; onClick?: () => void; color?: Colors }) {
    const { text, children, onClick, color } = props
    return (
        <button onClick={onClick} className={`theme ${color ?? 'primary'} btn`}>
            {text}
            {children}
        </button>
    )
}
