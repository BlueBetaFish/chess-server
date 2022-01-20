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
    private m_head: ListNode<Item> | null; 
    private m_tail: ListNode<Item> | null;
    private m_size: number; 


    constructor() {
        this.m_head = null;   
        this.m_tail = null;
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
        const oldtail = this.m_tail;
        this.m_tail = new ListNode(item);
        if (this.isEmpty()) this.m_head = this.m_tail;
        else oldtail.next = this.m_tail;
        this.m_size++;
        this.log();
    }

    /**
     * @returns item from the front of the queue, or 
     * null if the queue is empty
     */
    dequeue(): Item | null {
        if (this.isEmpty()) return null;
        const item = this.m_head.item;
        this.m_head = this.m_head.next;
        this.m_size--;
        this.log();
        return item;
    }

    log() {
        console.log("-------");
        console.log(this.m_size);
        let cur: ListNode<Item> = this.m_head;
        while (cur !== null) {
            console.log(cur.item);
            cur = cur.next;
        }
        console.log("-------");
    }
}