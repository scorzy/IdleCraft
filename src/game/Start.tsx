import { Fragment, useEffect, useState } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { Button } from '../components/ui/button'
import { PLAYER_ID } from '../characters/charactersConst'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { TrashIcon } from '../icons/IconsMemo'
import { useGameStore } from './state'
import { GetInitialGameState } from './InitialGameState'
import classes from './start.module.css'
import { load } from './functions/gameFunctions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const startGame = (gameId: string) => () => {
    if (gameId !== '')
        useGameStore.setState((s) => {
            s = GetInitialGameState()
            s.gameId = gameId
            const player = s.characters.entries[PLAYER_ID]
            if (player) player.name = gameId
            return s
        })
}

interface NameId {
    name: string
}

const loadGame = (name: string) => () => {
    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB")
        return
    }

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
            return
        }

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
    }, [])

    const deleteGame = (name: string) => () => {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB")
            return
        }
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

    if (!('indexedDB' in window))
        return (
            <div className={classes.container}>
                <Alert variant="destructive">
                    <TbAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>indexedDB not found, please check your browser permission</AlertDescription>
                </Alert>
            </div>
        )

    return (
        <div className={classes.container}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary">New Game</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" maxLength={10} className="col-span-3" value={name} onChange={onChange} />
                    <div>
                        <Button onClick={startGame(name)} disabled={name.length < 1}>
                            Start
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {loadName.length > 0 && (
                <>
                    <span className="text-center">Saved games:</span>
                    <div className={classes.btnContainer}>
                        {loadName.map((item) => (
                            <Fragment key={item.name}>
                                <Button onClick={loadGame(item.name)}>{item.name}</Button>
                                <Button onClick={deleteGame(item.name)} variant="ghost" title="delete">
                                    {TrashIcon}
                                </Button>
                            </Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
