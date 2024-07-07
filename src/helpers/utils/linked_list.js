class LinkedList {
    constructor(){
        this.head = null
        this.tail = null 
    }

    append(data){
        if (!this.head){
            this.head = data
            this.tail = data
        } else { 
            var prev = this.tail
            this.tail.next = data  
            this.tail = data
            this.tail.prev = prev 
        }
    }

}

class Node {
    constructor(data){
        this.data = data 
        this.next = null
        this.prev = null
    }
}

export {
    LinkedList, 
    Node
}