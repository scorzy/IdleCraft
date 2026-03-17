import { MapEx } from '../utils/MapEx'
import { GenerateQuestDataData, QuestTemplate } from './QuestTemplate'

export const QuestData: MapEx<string, QuestTemplate<GenerateQuestDataData>> = new MapEx<
    string,
    QuestTemplate<GenerateQuestDataData>
>()
