// account.service.js
import { createAccountInRepository, getAccountsFromRepository, deleteAccountInRepository } from "./account.repository.js";

// Fonction pour créer un compte
export async function createAccount(data) {
  if (!data.userId || !data.balance || !data.currency) {
    throw new Error("Missing required fields for account creation");
  }
  return await createAccountInRepository(data);
}

// Fonction pour récupérer les comptes d’un user
export async function getAccounts(userId) {
  if (!userId) {
    throw new Error("Missing userId");
  }
  return await getAccountsFromRepository(userId);
}

// Fonction pour supprimer un compte
export async function deleteAccount(userId, accountId) {
  if (!userId || !accountId) {
    throw new Error("Missing userId or accountId");
  }
  return await deleteAccountInRepository(userId, accountId);
}
