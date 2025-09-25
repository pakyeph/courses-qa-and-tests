import { describe, it, afterEach, expect, vi } from "vitest";
import assert from "assert";
import { createUser } from "./user.service";
import { createUserInRepository } from "./user.repository";

// --- Création du mock --- //
vi.mock("./user.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createUserInRepository: vi.fn((data) => {
    return {
      id: 4,
      name: data.name,
      birthday: data.birthday,
    };
  }),
}));

describe("User Service", () => {
  // On réinitialise le mock après chaque test
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create an user", async () => {
    const user = await createUser({
      name: "Valentin R",
      birthday: new Date(1980, 8, 13), // assez vieux pour passer
    });

    // Vérifications sur le retour
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.id).toBeTypeOf("number");
    expect(user).toHaveProperty("name", "Valentin R");
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1980);
    expect(user.birthday.getMonth()).toBe(8);

    // Vérification du mock
    expect(createUserInRepository).toBeCalledTimes(1);
    expect(createUserInRepository).toBeCalledWith({
      name: "Valentin R",
      birthday: new Date(1980, 8, 13),
    });
  });

  it("should trigger a bad request error when user creation", async () => {
    try {
      await createUser({
        name: "Valentin R", // pas de birthday → devrait échouer
      });
      assert.fail("createUser should trigger an error.");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }
  });

  it("should throw an error when user is too young", async () => {
    try {
      await createUser({
        name: "User trop jeune",
        birthday: new Date(), // aujourd'hui → âge 0 an → trop jeune
      });
      assert.fail("createUser should have thrown an error for a too young user.");
    } catch (e) {
      expect(e.name).toBe("HttpForbidden");
      expect(e.statusCode).toBe(403);
      expect(e.message).toBe("User is too young.");
    }
  });
});
