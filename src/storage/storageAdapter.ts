import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { StorageState } from './storageTypes'

class StorageAdapterInt extends AbstractEntityAdapter<StorageState> {
    getId(data: StorageState): string {
        return data.itemId
    }
}
export const StorageAdapter = new StorageAdapterInt()
