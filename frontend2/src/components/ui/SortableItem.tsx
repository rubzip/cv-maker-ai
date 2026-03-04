import React, { createContext, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from './Button';

interface SortableContextValue {
    attributes: any;
    listeners: any;
    setNodeRef: (node: HTMLElement | null) => void;
}

const SortableItemContext = createContext<SortableContextValue | null>(null);

export function useSortableItem() {
    const context = useContext(SortableItemContext);
    if (!context) {
        throw new Error('useSortableItem must be used within a SortableItem');
    }
    return context;
}

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.5 : undefined,
    };

    return (
        <SortableItemContext.Provider value={{ attributes, listeners, setNodeRef }}>
            <div ref={setNodeRef} style={style} className={cn("relative", className)}>
                {children}
            </div>
        </SortableItemContext.Provider>
    );
}

export function DragHandle({ children, className }: { children: React.ReactNode; className?: string }) {
    const { attributes, listeners } = useSortableItem();
    return (
        <div {...attributes} {...listeners} className={cn("cursor-grab active:cursor-grabbing", className)}>
            {children}
        </div>
    );
}
