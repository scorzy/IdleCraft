import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGameStore } from './state'
import { GetInitialGameState } from './InitialGameState'
import classes from './start.module.css'
import { LuTrash2 } from 'react-icons/lu'
import { load } from './gameFunctions'

const startGame = (gameId: string) => () => {
    if (gameId !== '')
        useGameStore.setState((s) => {
            s = GetInitialGameState()
            s.gameId = gameId
            return s
        })
}

interface NameId {
    name: string
}

const loadGame = (name: string) => () => {
    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB")
    } else {
        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readonly')
            const objectStore = transaction.objectStore('save')
            const req = objectStore.get(name)

            req.onsuccess = () => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const res = req.result

                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                load(res)
            }
        }
    }
}

export function Start() {
    const [name, setName] = useState('')
    const [loadName, setLoadName] = useState<NameId[]>([])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setName(newValue)
    }

    useEffect(() => {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB")
        } else {
            const open = window.indexedDB.open('IdleCraft', 1)
            open.onsuccess = () => {
                const db = open.result
                if (!db.objectStoreNames.contains('save')) return
                const transaction = db.transaction('save', 'readonly')
                const objectStore = transaction.objectStore('save')

                const nameIds: NameId[] = []
                transaction.oncomplete = () => setLoadName([...nameIds])

                const req = objectStore.getAll()
                req.onsuccess = () => {
                    const res = req.result
                    res.forEach((value) => {
                        if ('gameId' in value) {
                            nameIds.push({
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                name: value.gameId,
                            })
                        }
                    })
                }
            }
        }
    }, [])

    const deleteGame = (name: string) => () => {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB")
        } else {
            const open = window.indexedDB.open('IdleCraft', 1)
            open.onsuccess = () => {
                const db = open.result
                if (!db.objectStoreNames.contains('save')) return
                const transaction = db.transaction('save', 'readwrite')
                const objectStore = transaction.objectStore('save')
                const req = objectStore.delete(name)

                req.onsuccess = () => setLoadName(loadName.filter((e) => e.name !== name))
            }
        }
    }

    return (
        <div className={classes.container}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">New Game</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" maxLength={10} className="col-span-3" value={name} onChange={onChange} />
                    <div>
                        <Button type="submit" onClick={startGame(name)} disabled={name.length < 1}>
                            Start
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            Saved games:
            {loadName.map((item) => (
                <div key={item.name} className={classes.btnContainer}>
                    <Button type="submit" onClick={loadGame(item.name)}>
                        {item.name}
                    </Button>
                    <Button onClick={deleteGame(item.name)} variant="ghost">
                        <LuTrash2 className="text-lg" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
