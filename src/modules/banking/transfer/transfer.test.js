import { describe, it, afterEach, expect, vi } from "vitest";
import assert from "assert";
import { createTransfer, getTransfers } from "./transfer.service";
import { createTransferInRepository, getTransfersFromRepository } from "./transfer.repository";
import { patchAccount } from "../account/account.repository";

// --- Mock du repository --- //
vi.mock("./transfer.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createTransferInRepository: vi.fn((data) => ({
    id: 1,
    fromAccountId: data.fromAccountId,
    toAccountId: data.toAccountId,
    amount: data.amount,
    currency: data.currency,
    userId: data.userId,
  })),
  getTransfersFromRepository: vi.fn((userId) => [
    { id: 1, userId, fromAccountId: 1, toAccountId: 2, amount: 100, currency: "EUR" },
    { id: 2, userId, fromAccountId: 2, toAccountId: 3, amount: 200, currency: "USD" },
  ]),
}));

vi.mock("../account/account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  patchAccount: vi.fn(() => true),
}));

describe("Transfer Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a transfer successfully", async () => {
    const transfer = await createTransfer({
      fromAccountId: 1,
      toAccountId: 2,
      amount: 100,
      currency: "EUR",
      userId: 10,
    });

    expect(transfer).toBeDefined();
    expect(transfer.amount).toBe(100);
    expect(patchAccount).toBeCalledTimes(2);
    expect(createTransferInRepository).toBeCalled();
  });

  it("should fail to create transfer with missing params", async () => {
    try {
      await createTransfer({
        fromAccountId: 1,
        amount: 100,
      });
      assert.fail("createTransfer should trigger an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain("Missing required fields");
    }
  });

  it("should fail to create transfer with too high amount", async () => {
    try {
      await createTransfer({
        fromAccountId: 1,
        toAccountId: 2,
        amount: 20000,
        currency: "EUR",
        userId: 10,
      });
      assert.fail("createTransfer should trigger an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain("Insufficient funds");
    }
  });

  it("should fail to create transfer with negative amount", async () => {
    try {
      await createTransfer({
        fromAccountId: 1,
        toAccountId: 2,
        amount: -100,
        currency: "EUR",
        userId: 10,
      });
      assert.fail("createTransfer should trigger an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain("positive");
    }
  });

  it("should get transfers successfully", async () => {
    const transfers = await getTransfers(10);

    expect(transfers).toBeDefined();
    expect(transfers.length).toBe(2);
    expect(transfers[0].amount).toBeTypeOf("number");
    expect(transfers[1].currency).toBe("USD");

    expect(getTransfersFromRepository).toBeCalledWith(10);
  });
});
