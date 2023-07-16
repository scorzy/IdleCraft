import { describe, expect, it } from 'vitest'
import { createEntityAdapter } from './entityAdapter'

describe('EntityAdapter', () => {
    const adapter = createEntityAdapter<{ name: string }>({
        getId: (data) => data.name,
    })
    const adapter2 = createEntityAdapter<{ id: string; name: string }>({
        getId: (data) => data.id,
    })

    it('create first', () => {
        const state = {}
        const newState = adapter.create(state, { name: 'first' })
        expect(newState).toEqual({
            first: {
                name: 'first',
            },
        })
    })
    it('create second', () => {
        const state = { first: { name: 'first' } }
        const newState = adapter.create(state, { name: 'second' })
        expect(newState).toEqual({
            first: {
                name: 'first',
            },
            second: {
                name: 'second',
            },
        })
    })
    it('re create first', () => {
        const state = { first: { name: 'first' } }
        expect(() => adapter.create(state, { name: 'first' })).toThrowError('first already exists')
    })
    it('update', () => {
        const state = { first: { id: 'first', name: 'name1' } }
        const newState = adapter2.update(state, 'first', { name: 'second' })
        expect(newState).toEqual({
            first: { id: 'first', name: 'second' },
        })
    })
    it('update not exists', () => {
        const state = { first: { id: 'first', name: 'name1' } }
        expect(() => adapter2.update(state, 'second', { name: 'second' })).toThrowError("second doesn't exists")
    })
    it('upsertMerge', () => {
        const state = { first: { id: 'first', name: 'name1' } }
        const newState = adapter2.upsertMerge(state, { id: 'first', name: 'name2' })
        expect(newState).toEqual({
            first: { id: 'first', name: 'name2' },
        })
    })
    it('upsertMerge', () => {
        const state = { first: { id: 'first', name: 'name1' } }
        const newState = adapter2.upsertMerge(state, { id: 'second', name: 'name2' })
        expect(newState).toEqual({
            first: { id: 'first', name: 'name1' },
            second: { id: 'second', name: 'name2' },
        })
    })
    it('remove by id', () => {
        const state = {
            first: { id: 'first', name: 'name1' },
            second: { id: 'second', name: 'name2' },
        }
        const newState = adapter2.remove(state, 'second')
        expect(newState).toEqual({
            first: { id: 'first', name: 'name1' },
        })
    })
    it('remove by id not exists', () => {
        const state = {
            first: { id: 'first', name: 'name1' },
            second: { id: 'second', name: 'name2' },
        }
        expect(() => adapter2.remove(state, 'third')).toThrowError("third doesn't exists")
    })
})
