export const getItemId2 = (stdItemId: string | null | undefined, craftItemId: string | null | undefined) =>
    stdItemId ? `s${stdItemId}` : craftItemId ? `c${craftItemId}` : ''
