import { Slider as SliderPrimitive } from '@base-ui/react/slider'

import { cn } from '@/lib/utils'

function Slider({ className, ...props }: SliderPrimitive.Root.Props<number>) {
    return (
        <SliderPrimitive.Root
            data-slot="slider"
            className={cn('relative flex w-full touch-none items-center select-none', className)}
            {...props}
        >
            <SliderPrimitive.Control className="flex w-full items-center py-1" data-slot="slider-control">
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full"
                >
                    <SliderPrimitive.Indicator data-slot="slider-indicator" className="bg-primary absolute h-full" />
                    <SliderPrimitive.Thumb
                        data-slot="slider-thumb"
                        className="border-primary bg-background focus-visible:ring-ring/50 block size-4 shrink-0 rounded-full border shadow-xs transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
                    />
                </SliderPrimitive.Track>
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    )
}

export { Slider }
