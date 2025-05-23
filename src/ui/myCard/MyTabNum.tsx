import { memo } from 'react'
import { Badge } from '../../components/ui/badge'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import classes from './myTabNum.module.css'

export const MyTabNum = memo(function MyTabNum(props: { text: string; num: number }) {
    const { text, num } = props
    const { f } = useNumberFormatter()

    return (
        <div className={classes.tab}>
            {text} {num > 0 && <Badge className="ml-2">{f(num)}</Badge>}
        </div>
    )
})
