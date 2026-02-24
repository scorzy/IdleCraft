import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { ChargedAttack } from '../../activeAbilities/abilities/ChargedAttack'
import { NormalAttack } from '../../activeAbilities/abilities/NormalAttack'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { execAbilityTimer } from '../../activeAbilities/functions/execAbilityTimer'
import { ActivityTypes } from '../../activities/ActivityState'
import { getBattleIcon } from '../../battle/selectors/getBattleIcon'
import { getBattleTitle } from '../../battle/selectors/getBattleTitle'
import { removeBattle } from '../../battle/functions/removeBattle'
import { startBattle } from '../../battle/functions/startBattle'
import { startBattleTimer } from '../../battle/functions/startBattleTimer'
import { butcheringRecipe } from '../../butchering/ButcheringRecipe'
import { recipes } from '../../crafting/Recipes'
import { execCrafting } from '../../crafting/functions/execCrafting'
import { removeCrafting } from '../../crafting/functions/removeCrafting'
import { startCrafting } from '../../crafting/functions/startCrafting'
import { execMining } from '../../mining/functions/execMining'
import { getMiningIcon } from '../../mining/selectors/getMiningIcon'
import { getMiningTitle } from '../../mining/selectors/getMiningTitle'
import { removeMining } from '../../mining/functions/removeMining'
import { startMining } from '../../mining/functions/startMining'
import { QuestData } from '../../quests/QuestData'
import { TestQuestTemplate } from '../../quests/templates/TestQuestTemplates'
import { twoHSwordRecipe } from '../../smithing/recipes/2HSword'
import { armourRecipe } from '../../smithing/recipes/ArmourRecipes'
import { axeRecipe } from '../../smithing/recipes/AxeRecipe'
import { barRecipe } from '../../smithing/recipes/BarRecipe'
import { daggerRecipe } from '../../smithing/recipes/Dagger'
import { longSwordRecipe } from '../../smithing/recipes/LongSwordRecipe'
import { PickaxeRecipe } from '../../smithing/recipes/PickaxeRecipe'
import { execTreeGrow } from '../../wood/forest/execTreeGrow'
import { execWoodcutting } from '../../wood/functions/execWoodcutting'
import { getWoodcuttingIcon } from '../../wood/functions/getWoodcuttingIcon'
import { getWoodcuttingTitle } from '../../wood/functions/getWoodcuttingTitle'
import { removeWoodcutting } from '../../wood/functions/removeWoodcutting'
import { startWoodcutting } from '../../wood/functions/startWoodcutting'
import { handleRecipe } from '../../wood/recipes/HandleRecipe'
import { plankRecipe } from '../../wood/recipes/PlankRecipe'
import { onKillListeners } from '../../characters/functions/onKillListeners'
import { addKillBattleLog } from '../../battleLog/functions/addBattleLog'
import { onItemRemovedListeners } from '../../storage/storageEvents'
import { recipeOnItemRemove } from '../../crafting/RecipeFunctions'
import { questOnKillListener } from '../../quests/killRequest/questOnKillListener'
import { questOnItemRemove } from '../../quests/collectRequest/questOnItemRemove'
import { gatheringOnItemRemoved, gatheringOnKillListener } from '../../gathering/zoneListeners'
import { getCraftingIcon } from '../../crafting/selectors/getCraftingIcon'
import { getCraftingTitle } from '../../crafting/selectors/getCraftingTitle'
import {
    activityIcons,
    activityRemovers,
    activityStarters,
    activityTitles,
    activityExecutors,
    activityViewers,
} from '../globals'
import { viewCrafting } from '../../crafting/functions/viewCrafting'
import { viewWoodcutting } from '../../wood/functions/viewWoodcutting'
import { viewMining } from '../../mining/functions/viewMining'
import { execMiningVeinSearch } from '../../mining/functions/execMiningVeinSearch'
import { removeMiningVeinSearch } from '../../mining/functions/removeMiningVeinSearch'
import { startMiningVeinSearch } from '../../mining/functions/startMiningVeinSearch'
import { viewMiningVeinSearch } from '../../mining/functions/viewMiningVeinSearch'
import { getMiningVeinSearchTitle } from '../../mining/selectors/getMiningVeinSearchTitle'
import { getMiningVeinSearchIcon } from '../../mining/selectors/getMiningVeinSearchIcon'
import { potionRecipe } from '../../alchemy/PotionRecipe'
import { onEffectEnd } from '../../effects/effectsFunctions'
import { SupplyQuestTemplate } from '../../quests/templates/SupplyQuestTemplate'
import { execIncreaseGrowSpeed } from '../../wood/functions/execIncreaseGrowSpeed'
import { getIncreaseGrowSpeedIcon } from '../../wood/functions/getIncreaseGrowSpeedIcon'
import { getIncreaseGrowSpeedTitle } from '../../wood/functions/getIncreaseGrowSpeedTitle'
import { onGrowSpeedBonusEnd } from '../../wood/functions/onGrowSpeedBonusEnd'
import { removeIncreaseGrowSpeed } from '../../wood/functions/removeIncreaseGrowSpeed'
import { startIncreaseGrowSpeed } from '../../wood/functions/startIncreaseGrowSpeed'
import { viewIncreaseGrowSpeed } from '../../wood/functions/viewIncreaseGrowSpeed'
import { execGathering } from '../../gathering/functions/execGathering'
import { removeGathering } from '../../gathering/functions/removeGathering'
import { startGathering } from '../../gathering/functions/startGathering'
import { getGatheringTitle } from '../../gathering/functions/getGatheringTitle'
import { getGatheringIcon } from '../../gathering/functions/getGatheringIcon'
import { viewGathering } from '../../gathering/functions/viewGathering'

export function initialize() {
    initActivities()
    initRecipes()
    initAbilities()
    initQuests()
    initListeners()
}

function initActivities() {
    activityExecutors.set(ActivityTypes.Woodcutting, execWoodcutting)
    activityRemovers.set(ActivityTypes.Woodcutting, removeWoodcutting)
    activityStarters.set(ActivityTypes.Woodcutting, startWoodcutting)
    activityTitles.set(ActivityTypes.Woodcutting, getWoodcuttingTitle)
    activityIcons.set(ActivityTypes.Woodcutting, getWoodcuttingIcon)
    activityViewers.set(ActivityTypes.Woodcutting, viewWoodcutting)

    activityExecutors.set(ActivityTypes.IncreaseGrowSpeed, execIncreaseGrowSpeed)
    activityRemovers.set(ActivityTypes.IncreaseGrowSpeed, removeIncreaseGrowSpeed)
    activityStarters.set(ActivityTypes.IncreaseGrowSpeed, startIncreaseGrowSpeed)
    activityTitles.set(ActivityTypes.IncreaseGrowSpeed, getIncreaseGrowSpeedTitle)
    activityIcons.set(ActivityTypes.IncreaseGrowSpeed, getIncreaseGrowSpeedIcon)
    activityViewers.set(ActivityTypes.IncreaseGrowSpeed, viewIncreaseGrowSpeed)

    activityExecutors.set(ActivityTypes.Mining, execMining)
    activityRemovers.set(ActivityTypes.Mining, removeMining)
    activityStarters.set(ActivityTypes.Mining, startMining)
    activityTitles.set(ActivityTypes.Mining, getMiningTitle)
    activityIcons.set(ActivityTypes.Mining, getMiningIcon)
    activityViewers.set(ActivityTypes.Mining, viewMining)

    activityExecutors.set(ActivityTypes.MiningVeinSearch, execMiningVeinSearch)
    activityRemovers.set(ActivityTypes.MiningVeinSearch, removeMiningVeinSearch)
    activityStarters.set(ActivityTypes.MiningVeinSearch, startMiningVeinSearch)
    activityTitles.set(ActivityTypes.MiningVeinSearch, getMiningVeinSearchTitle)
    activityIcons.set(ActivityTypes.MiningVeinSearch, getMiningVeinSearchIcon)
    activityViewers.set(ActivityTypes.MiningVeinSearch, viewMiningVeinSearch)

    activityExecutors.set(ActivityTypes.Crafting, execCrafting)
    activityRemovers.set(ActivityTypes.Crafting, removeCrafting)
    activityStarters.set(ActivityTypes.Crafting, startCrafting)
    activityTitles.set(ActivityTypes.Crafting, getCraftingTitle)
    activityIcons.set(ActivityTypes.Crafting, getCraftingIcon)
    activityViewers.set(ActivityTypes.Crafting, viewCrafting)

    activityExecutors.set(ActivityTypes.Gathering, execGathering)
    activityRemovers.set(ActivityTypes.Gathering, removeGathering)
    activityStarters.set(ActivityTypes.Gathering, startGathering)
    activityTitles.set(ActivityTypes.Gathering, getGatheringTitle)
    activityIcons.set(ActivityTypes.Gathering, getGatheringIcon)
    activityViewers.set(ActivityTypes.Gathering, viewGathering)

    activityRemovers.set(ActivityTypes.Battle, removeBattle)
    activityStarters.set(ActivityTypes.Battle, startBattle)
    activityTitles.set(ActivityTypes.Battle, getBattleTitle)
    activityIcons.set(ActivityTypes.Battle, getBattleIcon)

    activityExecutors.set(ActivityTypes.Tree, execTreeGrow)
    activityExecutors.set(ActivityTypes.Ability, execAbilityTimer)
    activityExecutors.set(ActivityTypes.StartBattle, startBattleTimer)

    activityExecutors.set(ActivityTypes.Effect, onEffectEnd)
    activityExecutors.set(ActivityTypes.GrowSpeedBonus, onGrowSpeedBonusEnd)
}

function initRecipes() {
    recipes.set(plankRecipe.id, plankRecipe)
    recipes.set(handleRecipe.id, handleRecipe)
    recipes.set(barRecipe.id, barRecipe)
    recipes.set(axeRecipe.id, axeRecipe)
    recipes.set(PickaxeRecipe.id, PickaxeRecipe)
    recipes.set(daggerRecipe.id, daggerRecipe)
    recipes.set(longSwordRecipe.id, longSwordRecipe)
    recipes.set(twoHSwordRecipe.id, twoHSwordRecipe)
    recipes.set(armourRecipe.id, armourRecipe)
    recipes.set(butcheringRecipe.id, butcheringRecipe)
    recipes.set(potionRecipe.id, potionRecipe)
}
function initAbilities() {
    ActiveAbilityData.set(AbilitiesEnum.NormalAttack, new NormalAttack())
    ActiveAbilityData.set(AbilitiesEnum.ChargedAttack, new ChargedAttack())
}

function initQuests() {
    QuestData.set('kill-n', new TestQuestTemplate())
    QuestData.set('SupplyQuest', new SupplyQuestTemplate())
}

function initListeners() {
    onKillListeners.push(addKillBattleLog)
    onKillListeners.push(questOnKillListener)
    onKillListeners.push(gatheringOnKillListener)

    onItemRemovedListeners.push(questOnItemRemove)
    onItemRemovedListeners.push(recipeOnItemRemove)
    onItemRemovedListeners.push(gatheringOnItemRemoved)
}
