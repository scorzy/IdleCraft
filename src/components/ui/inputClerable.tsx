import { InfoIcon } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'

export function InputInputGroup() {
    return (
        <InputGroup>
            <InputGroupInput id="input-group-url" placeholder="example.com" />
            <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                <InfoIcon />
            </InputGroupAddon>
        </InputGroup>
    )
}
