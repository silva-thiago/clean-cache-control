import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usescases'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  key!: string

  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
  }
}

type SUTTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSUT = (): SUTTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache in sut.init', () => {
    const { cacheStore } = makeSUT()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache in sut.save', async () => {
    const { sut, cacheStore } = makeSUT()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.key).toBe('purchases')
  })

  test('Should not insert new cache if delete fails', async () => {
    const { sut, cacheStore } = makeSUT()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })
})
