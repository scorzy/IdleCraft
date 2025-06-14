import { useEffect, useState } from 'react'

function getIsDocumentHidden() {
    return !document.hidden
}

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(() => getIsDocumentHidden())
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())

    useEffect(() => {
        document.addEventListener('visibilitychange', onVisibilityChange, false)

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    })

    return isVisible
}
