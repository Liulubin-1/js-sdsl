export type BaseType = {
    size: () => number;
    empty: () => boolean;
    clear: () => void;
} & Record<string, never>;

export type ContainerType<T> = {
    front: () => T | undefined;
    back: () => T | undefined;
    forEach: (callback: (element: T, index: number) => void) => void;
    getElementByPos: (pos: number) => T;
    eraseElementByPos: (pos: number) => void;
    eraseElementByValue: (value: T) => void;
} & BaseType;

export type SequentialContainerType<T> = {
    push_back: (element: T) => void;
    pop_back: () => void;
    setElementByPos: (pos: number, element: T) => void;
    insert: (pos: number, element: T, num?: number) => void;
    reverse: () => void;
    unique: () => void;
    sort: (cmp?: (x: T, y: T) => number) => void;
} & ContainerType<T>;

export type AssociativeContainersType<T> = {
    insert: (element: T) => void;
    find: (element: T) => boolean;
    union: (other: AssociativeContainersType<T>) => void;
    getHeight: () => number;
} & ContainerType<T>;
