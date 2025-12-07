/* eslint-env jest */
import LocalStorage, { localStorageKey } from '../Database/LocalStorage'

function createMockDB() {
  const store = new Map()
  const adapter = {
    getLocal: async (key) => {
      return store.has(key) ? store.get(key) : null
    },
    setLocal: async (key, json) => {
      store.set(key, json)
    },
    removeLocal: async (key) => {
      store.delete(key)
    },
    underlyingAdapter: {
      getLocal: (key, callback) => {
        const value = store.has(key) ? store.get(key) : undefined
        callback({ value })
      },
    },
  }
  return { adapter }
}

describe('LocalStorage demo', () => {
  test('set and get basic types', async () => {
    const db = createMockDB()
    const ls = new LocalStorage(db)
    const key = localStorageKey('demo:number')
    await ls.set(key, 42)
    const res = await ls.get(key)
    expect(res).toBe(42)

    const key2 = localStorageKey('demo:obj')
    const obj = { a: 1, b: 'x', c: false }
    await ls.set(key2, obj)
    const res2 = await ls.get(key2)
    expect(res2).toEqual(obj)

    const key3 = localStorageKey('demo:null')
    await ls.set(key3, null)
    expect(await ls.get(key3)).toBeNull()
  })

  test('_getSync with callback', (done) => {
    const db = createMockDB()
    const ls = new LocalStorage(db)
    const key = localStorageKey('demo:sync')
    ls.set(key, { ok: true }).then(() => {
      ls._getSync(key, (value) => {
        expect(value).toEqual({ ok: true })
        done()
      })
    })
  })

  test('remove deletes value', async () => {
    const db = createMockDB()
    const ls = new LocalStorage(db)
    const key = localStorageKey('demo:rm')
    await ls.set(key, 'toBeRemoved')
    expect(await ls.get(key)).toBe('toBeRemoved')
    await ls.remove(key)
    expect(await ls.get(key)).toBeUndefined()
  })

  test('setting non-serializable value throws', async () => {
    const db = createMockDB()
    const ls = new LocalStorage(db)
    const key = localStorageKey('demo:fn')
    await expect(ls.set(key, () => {})).rejects.toThrow('Value not JSON-serializable')
  })
})
