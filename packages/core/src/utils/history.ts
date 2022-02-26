class History<T> extends EventTarget {
  static EventTypes = {
    change: 'change',
  }

  current = -1
  records: T[] = []

  get canUndo() {
    return this.records.length > 0 && this.current > 0
  }

  get canRedo() {
    return this.current < this.records.length - 1
  }

  get(): T {
    return this.records[this.current]
  }

  pushSync(state: T) {
    const { records, current } = this
    this.records = records.slice(0, current + 1)
    this.records.push(state)
    this.current = this.records.length - 1
    this.dispatchEvent(new Event(History.EventTypes.change))
    return this
  }

  undo() {
    if (!this.canUndo) return this
    this.current = Math.max(0, this.current - 1)
    this.dispatchEvent(new Event(History.EventTypes.change))
    return this
  }

  redo() {
    if (!this.canRedo) return this
    this.current = Math.min(this.records.length - 1, this.current + 1)
    this.dispatchEvent(new Event(History.EventTypes.change))
    return this
  }
}

export { History }
