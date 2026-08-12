import { myMemoize } from '../utils/myMemoize'
import { VolumeUnit } from './VolumeUnit'

const DM3_PER_M3 = 1e3
const CM3_PER_M3 = 1e6
const MM3_PER_M3 = 1e9

export interface VolumeConversion {
    value: number
    unit: VolumeUnit
}

export const convertVolume = myMemoize(function convertVolume(volumeM3: number): VolumeConversion {
    if (volumeM3 >= 1) return { value: volumeM3, unit: VolumeUnit.M3 }
    const dm3 = volumeM3 * DM3_PER_M3
    if (dm3 >= 1) return { value: dm3, unit: VolumeUnit.DM3 }
    const cm3 = volumeM3 * CM3_PER_M3
    if (cm3 >= 1) return { value: cm3, unit: VolumeUnit.CM3 }
    return { value: volumeM3 * MM3_PER_M3, unit: VolumeUnit.MM3 }
})
