import { LocalLoadPurchases } from '@/data/usescases'
import { CacheStoreSpy, mockPurchases } from '@/data/tests'
import { time } from 'console'

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

  test('Should return an empty list if load fails', async () => {
    const { sut, cacheStore } = makeSUT()
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  test('Should call correct key on load and return a list of purchases if cache is less than 3 days old', async () => {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { sut, cacheStore } = makeSUT(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })

  test('Should return an empty list of purchases if cache is older than 3 days old', async () => {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
    const { sut, cacheStore } = makeSUT(currentDate)
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
})
