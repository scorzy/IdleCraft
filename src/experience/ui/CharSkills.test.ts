import { describe, expect, it } from 'vitest'
import { skillMatchesSearch } from './CharSkills'

describe('skillMatchesSearch', () => {
    it('matches every skill when the search is empty or whitespace', () => {
        expect(skillMatchesSearch('Mining Level', '')).toBe(true)
        expect(skillMatchesSearch('Mining Level', '   ')).toBe(true)
    })

    it('matches skill names case-insensitively and trims the search', () => {
        expect(skillMatchesSearch('Mining Level', '  minING  ')).toBe(true)
        expect(skillMatchesSearch('Mining Level', 'level')).toBe(true)
    })

    it('does not match unrelated skill names', () => {
        expect(skillMatchesSearch('Mining Level', 'archery')).toBe(false)
    })
})
