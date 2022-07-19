class TagQueue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    enqueueTags(tags) {
        tags.forEach(tag => {
            this.elements[this.tail] = tag;
            this.tail++;
        });
    }

    dequeueTags(timestamp) {
        if (this.length > 0) {
            let tags = [];
            while (!this.isEmpty && this.peekTimestamp().getTime() < timestamp) {
                const item = this.elements[this.head];
                delete this.elements[this.head];
                this.head++;
                tags.push(item);
            }
            return tags;
        }
        if (this.isEmpty) {
            this.head = 0;
            this.tail = 0;
        }
        return [];
    }

    peekTimestamp() {
        return this.elements[this.head].tag.timestamp;
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

}

module.exports = {TagQueue};