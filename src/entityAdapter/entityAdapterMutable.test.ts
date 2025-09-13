import { describe, expect, it } from 'vitest'
import { AbstractEntityAdapter } from './entityAdapter'

class TestEntityAdapter extends AbstractEntityAdapter<{ name: string }> {
    getId(data: { name: string }): string {
        return data.name
    }
}
class TestEntityAdapter2 extends AbstractEntityAdapter<{ id: string; name: string }> {
    getId(data: { id: string; name: string }): string {
        return data.id
    }
}

describe('EntityAdapter Mutable', () => {
    const adapter = new TestEntityAdapter()
    const adapter2 = new TestEntityAdapter2()

    it('create first', () => {
        const state = adapter.getInitialState()
        const newState = adapter.create(state, { name: 'first' })
        expect(newState).toEqual({ entries: { first: { name: 'first' } }, ids: ['first'] })
        expect(adapter.getIds(newState)).toEqual(['first'])
        expect(state).toBe(newState)
    })
    it('create second', () => {
        const state = { entries: { first: { name: 'first' } }, ids: ['first'] }
        const newState = adapter.create(state, { name: 'second' })
        expect(newState).toEqual({
            entries: {
                first: { name: 'first' },
                second: { name: 'second' },
            },
            ids: ['first', 'second'],
        })
        expect(state).toBe(newState)
    })
    it('update', () => {
        const state = { entries: { first: { id: 'first', name: 'name1' } }, ids: ['first'] }
        const newState = adapter2.update(state, 'first', { name: 'second' })
        expect(newState).toEqual({ entries: { first: { id: 'first', name: 'second' } }, ids: ['first'] })
        expect(state).toBe(newState)
    })
    it('update not exists', () => {
        const state = { entries: { first: { id: 'first', name: 'name1' } }, ids: ['first'] }
        expect(() => adapter2.update(state, 'second', { name: 'second' })).toThrowError("second doesn't exists")
    })
    it('upsertMerge', () => {
        const state = { entries: { first: { id: 'first', name: 'name1' } }, ids: ['first'] }
        const newState = adapter2.upsertMerge(state, { id: 'first', name: 'name2' })
        expect(newState).toEqual({ entries: { first: { id: 'first', name: 'name2' } }, ids: ['first'] })
        expect(state).toBe(newState)
    })
    it('upsertMerge', () => {
        const state = { entries: { first: { id: 'first', name: 'name1' } }, ids: ['first'] }
        const newState = adapter2.upsertMerge(state, { id: 'second', name: 'name2' })
        expect(newState).toEqual({
            entries: { first: { id: 'first', name: 'name1' }, second: { id: 'second', name: 'name2' } },
            ids: ['first', 'second'],
        })
        expect(state).toBe(newState)
    })
    it('remove by id', () => {
        const state = {
            entries: {
                first: { id: 'first', name: 'name1' },
                second: { id: 'second', name: 'name2' },
            },
            ids: ['first', 'second'],
        }
        const newState = adapter2.remove(state, 'second')
        expect(newState).toEqual({
            entries: {
                first: { id: 'first', name: 'name1' },
            },
            ids: ['first'],
        })
        expect(state).toBe(newState)
    })
    it('remove by id not exists', () => {
        const state = {
            entries: {
                first: { id: 'first', name: 'name1' },
                second: { id: 'second', name: 'name2' },
            },
            ids: ['first', 'second'],
        }
        expect(() => adapter2.remove(state, 'third')).toThrowError("third doesn't exists")
    })
})
