
export const Hierarchy = (h: any) => ({
    toBreadcrumb: (parts: string[] = []) : string[] => {
        if(!h.parent){
            (parts.push('root'));
            return parts.reverse();
        }
        (parts.push(h.data.name));
        return h.parent ? Hierarchy(h.parent).toBreadcrumb(parts) : parts;
    },
});