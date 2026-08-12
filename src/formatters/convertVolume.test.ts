import { describe, expect, it } from 'vitest'
import { convertVolume } from './convertVolume'
import { VolumeUnit } from './VolumeUnit'

describe('convertVolume', () => {
    it('converts zero to mm³', () => {
        expect(convertVolume(0)).toEqual({ value: 0, unit: VolumeUnit.MM3 })
    })

    it('converts tiny volumes to mm³', () => {
        expect(convertVolume(0.0000005)).toEqual({ value: 500, unit: VolumeUnit.MM3 })
    })

    it('converts small volumes to cm³', () => {
        expect(convertVolume(0.00005)).toEqual({ value: 50, unit: VolumeUnit.CM3 })
    })

    it('converts mid-range volumes to dm³', () => {
        expect(convertVolume(0.15)).toEqual({ value: 150, unit: VolumeUnit.DM3 })
    })

    it('converts volumes of 1 m³ or more to m³', () => {
        expect(convertVolume(1)).toEqual({ value: 1, unit: VolumeUnit.M3 })
        expect(convertVolume(2.5)).toEqual({ value: 2.5, unit: VolumeUnit.M3 })
    })
})
