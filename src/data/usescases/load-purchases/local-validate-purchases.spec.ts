import { LocalLoadPurchases } from '@/data/usescases'
import { CacheStoreSpy, getCacheExpirationDate } from '@/data/tests'

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

describe('LocalValidatePurchases', () => {
  test('Should not delete or insert cache in sut.init', () => {
    const { cacheStore } = makeSUT()
    expect(cacheStore.actions).toEqual([])
  })

  test('Should delete cache if load fails', () => {
    const { sut, cacheStore } = makeSUT()
    cacheStore.simulateFetchError()
    sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Should has no side effect if load succeeds', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { sut, cacheStore } = makeSUT(currentDate)
    cacheStore.fetchResult = { timestamp }
    sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })
})
