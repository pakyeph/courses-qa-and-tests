import { describe, it, afterEach, expect, vi } from "vitest";
import assert from "assert";
import { createAccount, getAccounts, deleteAccount } from "./account.service";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountInRepository,
} from "./account.repository";

// --- Mock du repository --- //
vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn((data) => ({
    id: 1,
    userId: data.userId,
    balance: data.balance,
    currency: data.currency,
  })),
  getAccountsFromRepository: vi.fn((userId) => [
    { id: 1, userId, balance: 1000, currency: "EUR" },
    { id: 2, userId, balance: 2000, currency: "USD" },
  ]),
  deleteAccountInRepository: vi.fn((userId, accountId) => {
    if (accountId === 999) {
      throw new Error("Account not found");
    }
    return true;
  }),
}));

describe("Account Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create an account successfully", async () => {
    const account = await createAccount({
      userId: 10,
      balance: 500,
      currency: "EUR",
    });

    expect(account).toBeDefined();
    expect(account.id).toBeTypeOf("number");
    expect(account.userId).toBe(10);
    expect(account.balance).toBe(500);
    expect(account.currency).toBe("EUR");
    expect(createAccountInRepository).toBeCalledWith({
      userId: 10,
      balance: 500,
      currency: "EUR",
    });
  });

  it("should fail to create account with missing parameters", async () => {
    try {
      await createAccount({
        balance: 500,
        // userId et currency manquent
      });
      assert.fail("createAccount should trigger an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain("Missing required fields");
    }
  });

  it("should get accounts successfully", async () => {
    const accounts = await getAccounts(10);

    expect(accounts).toBeDefined();
    expect(accounts.length).toBe(2);
    expect(accounts[0]).toHaveProperty("id");
    expect(accounts[0].userId).toBe(10);
    expect(accounts[0].balance).toBeTypeOf("number");
    expect(accounts[0].currency).toBe("EUR");
    expect(accounts[1].currency).toBe("USD");

    expect(getAccountsFromRepository).toBeCalledWith(10);
  });

  it("should delete an account successfully", async () => {
    const result = await deleteAccount(10, 1);

    expect(result).toBe(true);
    expect(deleteAccountInRepository).toBeCalledWith(10, 1);
  });

  it("should fail to delete an account with wrong id", async () => {
    try {
      await deleteAccount(10, 999);
      assert.fail("deleteAccount should trigger an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe("Account not found");
    }
  });
});
