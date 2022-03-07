import { ContainerIterator, SequentialContainerType } from "../Base/Base";

export type VectorType<T> = SequentialContainerType<T>;

const VectorIterator = function <T>(this: ContainerIterator<T>, index: number, getElementByPos: (pos: number) => T, position: 'begin' | 'end' | 'mid' = 'mid') {
    Object.defineProperties(this, {
        node: {
            value: index
        },
        position: {
            value: position
        },
        pointer: {
            value: position === 'end' ? undefined : getElementByPos(index),
            enumerable: true
        }
    });

    this.equals = function (obj: ContainerIterator<T>) {
        // @ts-ignore
        return this.node === obj.node && this.position === obj.position;
    }

    this.pre = function () {
        if (position === 'begin') throw new Error("Iterator access denied!");
        return new VectorIterator(index - 1, getElementByPos);
    };

    this.next = function () {
        if (position === 'end') throw new Error("Iterator access denied!");
        return new VectorIterator(index + 1, getElementByPos);
    };
} as unknown as { new<T>(pos: number, getElementByPos: (index: number) => T, position?: 'begin' | 'end' | 'mid'): ContainerIterator<T> };

function Vector<T>(this: VectorType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    let len = 0;
    const vector: T[] = [];

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        vector.length = 0;
    };

    this.begin = function () {
        return new VectorIterator(0, this.getElementByPos, 'begin');
    };

    this.end = function () {
        return new VectorIterator(len, this.getElementByPos, 'end');
    }

    this.rBegin = function () {
        return new VectorIterator(len - 1, this.getElementByPos, 'begin');
    }

    this.rEnd = function () {
        return new VectorIterator(-1, this.getElementByPos, 'end');
    }

    this.front = function () {
        if (this.empty()) return undefined;
        return vector[0];
    };

    this.back = function () {
        if (this.empty()) return undefined;
        return vector[len - 1];
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        vector.forEach(callback);
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        return vector[pos];
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        for (let i = pos; i < len - 1; ++i) vector[i] = vector[i + 1];
        this.popBack();
    };

    this.eraseElementByValue = function (value: T) {
        const newArr: T[] = [];
        this.forEach(element => {
            if (element !== value) newArr.push(element);
        });
        newArr.forEach((element, index) => {
            vector[index] = element;
        });
        const newLen = newArr.length;
        while (len > newLen) this.popBack();
    };

    this.pushBack = function (element: T) {
        vector.push(element);
        ++len;
    };

    this.popBack = function () {
        vector.pop();
        if (len > 0) --len;
    };

    this.setElementByPos = function (pos: number, element: T) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        vector[pos] = element;
    };

    this.insert = function (pos: number, element: T, num = 1) {
        if (pos < 0 || pos > len) throw new Error("pos must more than 0 and less than or equal to vector's size");
        vector.splice(pos, 0, ...new Array<T>(num).fill(element));
        len += num;
    };

    this.find = function (element: T) {
        for (let i = 0; i < len; ++i) {
            if (vector[i] === element) return new VectorIterator(i, this.getElementByPos);
        }
        return this.end();
    };

    this.reverse = function () {
        vector.reverse();
    };

    this.unique = function () {
        let pre: T;
        const newArr: T[] = [];
        this.forEach((element, index) => {
            if (index === 0 || element !== pre) {
                newArr.push(element);
                pre = element;
            }
        });
        newArr.forEach((element, index) => {
            vector[index] = element;
        });
        const newLen = newArr.length;
        while (len > newLen) this.popBack();
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        vector.sort(cmp);
    };

    this[Symbol.iterator] = function () {
        return (function* () {
            return yield* vector;
        })();
    };

    container.forEach(element => this.pushBack(element));
}

export default (Vector as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }): VectorType<T>; });
