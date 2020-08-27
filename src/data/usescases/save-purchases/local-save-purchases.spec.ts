import { LocalSavePurchases } from '@/data/usescases'
import { CacheStoreSpy, mockPurchases } from '@/data/tests'

type SUTTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSUT = (timestamp = new Date()): SUTTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete or insert cache in sut.init', () => {
    const { cacheStore } = makeSUT()
    expect(cacheStore.messages).toEqual([])
  })

  test('Should delete old cache in sut.save', async () => {
    const { sut, cacheStore } = makeSUT()
    await sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Should not insert new cache if delete fails or succeeds', async () => {
    const timestamp = new Date()
    const { sut, cacheStore } = makeSUT(timestamp)
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    })
  })

  test('Should throw if insert throws', async () => {
    const { sut, cacheStore } = makeSUT()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    await expect(promise).rejects.toThrow()
  })
})
