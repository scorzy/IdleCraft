import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import React from "react" 

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

// const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className,children, ...props }, ref) => (
    <CollapsiblePrimitive.CollapsibleContent ref={ref} 
       className={'CollapsibleContent' + ( className ? " " +className : "" )}
     {...props} >
        {children}
    </CollapsiblePrimitive.CollapsibleContent>
))
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
