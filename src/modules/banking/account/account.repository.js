// account.repository.js

export async function createAccountInRepository(data) {
  // Ici normalement, on ferait une requête SQL vers Postgres
  // Mais en test, c'est mocké, donc la logique est remplacée.
  throw new Error("Not implemented: createAccountInRepository");
}

export async function getAccountsFromRepository(userId) {
  throw new Error("Not implemented: getAccountsFromRepository");
}

export async function deleteAccountInRepository(userId, accountId) {
  throw new Error("Not implemented: deleteAccountInRepository");
}

export async function patchAccount(accountId, delta) {
  throw new Error("Not implemented: patchAccount");
}
