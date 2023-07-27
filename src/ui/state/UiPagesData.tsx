import { TbList } from 'react-icons/tb'
import { UiPages, UiPageData } from './UiPages'
import { Msg } from '../../msg/Msg'

export const UiPagesData: { [k in UiPages]: UiPageData } = {
    [UiPages.Activities]: {
        getText: (m: Msg) => m.Activities,
        icon: <TbList />,
    },
    [UiPages.Storage]: {
        getText: (m: Msg) => m.Storage,
        icon: <TbList />,
    },
    [UiPages.Woodcutting]: {
        getText: (m: Msg) => m.Woodcutting,
        icon: <TbList />,
    },
}
