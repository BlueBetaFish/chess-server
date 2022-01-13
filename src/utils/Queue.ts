/**
 * class ListNode<Item> represents a generic Linked List node 
 */
class ListNode<Item> {
    readonly item: Item | null;
    next: ListNode<Item> | null;

    constructor(item: Item = null, next: ListNode<Item> | null = null) {
        this.item = item;
        this.next = next;
    }
}

/**
 * class Queue<Item> represents a first-in-first-out 
 * queue of generic items. Supported methods are 
 * enqueue, dequeue, size and isEmpty
 */
export class Queue<Item> {
    private m_head: ListNode<Item>; // dummy head of Queue
    private m_tail: ListNode<Item>; // last node 
    private m_size: number;         // size of queue


    constructor() {
        this.m_head = new ListNode<Item>();     // dummy node
        this.m_tail = this.m_head;
        this.m_size = 0;
    }

    /**
     * @returns size of the queue
     */
    size(): number { return this.m_size; }

    /**
     * @returns true if queue is empty, false otherwise
     */
    isEmpty(): boolean { return this.m_size === 0; }

    /**
     * @param item inserted at the end of queue
     */
    enqueue(item: Item): void {
        this.m_tail.next = new ListNode<Item>(item);
        this.m_tail = this.m_tail.next;
        this.m_size++;
    }

    /**
     * @returns item from the front of the queue, or 
     * null if the queue is empty
     */
    dequeue(): Item | null {
        if (this.m_size == 0) return null;
        const item = this.m_head.next.item;
        this.m_head.next = this.m_head.next.next;
        this.m_size--;
        return item;
    }
}