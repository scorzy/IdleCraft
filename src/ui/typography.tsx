export const TitleH1 = (props: React.ComponentProps<'h1'>) => {
    return (
        <h1
            className="grid scroll-m-20 grid-cols-[auto_1fr] items-center gap-1.5 text-3xl font-extrabold tracking-tight text-balance"
            {...props}
        >
            {props.children}
        </h1>
    )
}
export const TypographyP = (props: React.ComponentProps<'p'>) => {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
            {props.children}
        </p>
    )
}
