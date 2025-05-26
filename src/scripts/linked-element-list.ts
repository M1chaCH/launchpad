export interface LinkedElement<T> {
  next: LinkedElement<T>;
  previous: LinkedElement<T>;
  current: T;
}

export function buildLoopingLinkedList<T>(elements: Iterable<T>): LinkedElement<T> | null {
  const list = [...elements];
  if (list.length < 1) {
    throw new Error("Cannot build linked list from empty list");
  }

  const head: LinkedElement<T> = {
    previous: null!,
    current: list[0],
    next: null!,
  };

  if (list.length === 1) {
    head.previous = head;
    head.next = head;
    return head;
  }

  let previous = head;
  list.forEach((element, index) => {
    if (index === 0) {
      return;
    }

    const current: LinkedElement<T> = {
      previous: previous,
      current: element,
      next: null!,
    };

    previous.next = current;
    previous = current;

    if (list.length - 1 === index) {
      head.previous = current;
      current.next = head;
    }
  });

  return head;
}
