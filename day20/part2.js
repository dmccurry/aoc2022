const fs = require('fs');
const { setMaxIdleHTTPParsers } = require('http');
let list;
let nodes = {};
const key = 811589153;

class Node {
  constructor(v) {
    this.value = v;
    this.next = null;
    this.prev = null;
  }
}

fs.readFile('./input', 'utf-8', (_, data) => {
  list = data.split('\n').map(n => parseInt(n));
  let prev;
  let head;
  let zero;
  for (let i=0; i<list.length; i++) {
    let n = new Node(list[i]);
    let k = `${i}|${list[i]}`;
    nodes[k] = n;
    if (prev) {
      prev.next = n;
      n.prev = prev;
    } else {
      head = n;
    }
    prev = n;
    if (n.value == 0) zero = n;
  }
  prev.next = head;
  head.prev = prev;

  for (let i=0; i<10; i++) {
    mix();
  }

  let n = zero;
  let solution = 0;
  for (let i=0; i<3000; i++) {
    n = n.next;
    if (i == 999 || i == 1999 || i == 2999) {
      solution += (n.value * key);
    }
  }
  console.log(solution);
});

const mix = () => {
  for (let i=0; i<list.length; i++) {
    let k = `${i}|${list[i]}`;
    let node = nodes[k];
    if (node.value == 0) {
      continue;
    }
    let amt = Math.abs(node.value * key) % (list.length - 1);
    if (amt == 0) {
      continue;
    }

    // remove the node
    node.prev.next = node.next;
    node.next.prev = node.prev;

    let current = (node.value > 0) ? node.next : node.prev;
    while (--amt > 0) {
      if (node.value > 0) {
        current = current.next;
      } else {
        current = current.prev;
      }
    }

    if (node.value > 0) {
      // after current
      let currentNext = current.next;
      current.next = node;
      node.next = currentNext;
      node.prev = current;
      currentNext.prev = node;
    } else {
      let currentPrev = current.prev;
      current.prev = node;
      node.prev = currentPrev;
      node.next = current;
      currentPrev.next = node;
    }
  }
}