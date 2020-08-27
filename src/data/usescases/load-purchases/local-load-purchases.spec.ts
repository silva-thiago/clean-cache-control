import { LocalLoadPurchases } from '@/data/usescases'
import { CacheStoreSpy } from '@/data/tests'

type SUTTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}

const makeSUT = (timestamp = new Date()): SUTTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalLoadPurchases', () => {
  test('Should not delete or insert cache in sut.init', () => {
    const { cacheStore } = makeSUT()
    expect(cacheStore.actions).toEqual([])
  })

  test('Should call correct key on load', async () => {
    const { sut, cacheStore } = makeSUT()
    await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })
})
