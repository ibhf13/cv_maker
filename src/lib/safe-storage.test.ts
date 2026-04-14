import { beforeEach, describe, expect, it, vi } from "vitest"
import { safeStorage } from "./safe-storage"

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}))

function makeFakeStorage(setItemImpl?: (k: string, v: string) => void): Storage {
  const map = new Map<string, string>()
  return {
    get length() { return map.size },
    key: (i) => Array.from(map.keys())[i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: setItemImpl ?? ((k, v) => { map.set(k, v) }),
    removeItem: (k) => { map.delete(k) },
    clear: () => map.clear(),
  }
}

describe("safeStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("forwards reads/writes to the inner storage", () => {
    const inner = makeFakeStorage()
    const wrapped = safeStorage(inner, "test")
    wrapped.setItem("a", "1")
    expect(wrapped.getItem("a")).toBe("1")
    expect(wrapped.length).toBe(1)
  })

  it("swallows QuotaExceededError and shows the toast once", async () => {
    const { toast } = await import("sonner")
    const quota = () => {
      const e = new Error("quota")
      e.name = "QuotaExceededError"
      throw e
    }
    const inner = makeFakeStorage(quota)
    const wrapped = safeStorage(inner, "saved versions")

    wrapped.setItem("a", "1")
    wrapped.setItem("b", "2")

    expect(toast.error).toHaveBeenCalledTimes(1)
    expect((toast.error as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0])
      .toContain("saved versions")
  })

  it("rethrows non-quota errors", () => {
    const inner = makeFakeStorage(() => { throw new Error("boom") })
    const wrapped = safeStorage(inner, "test")
    expect(() => wrapped.setItem("a", "1")).toThrow("boom")
  })
})
