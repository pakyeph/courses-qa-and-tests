// transfer.service.js
import { createTransferInRepository, getTransfersFromRepository } from "./transfer.repository.js";
import { patchAccount } from "../account/account.repository.js";

export async function createTransfer(data) {
  const { fromAccountId, toAccountId, amount, currency, userId } = data;

  if (!fromAccountId || !toAccountId || !amount || !currency || !userId) {
    throw new Error("Missing required fields for transfer");
  }

  if (amount <= 0) {
    throw new Error("Transfer amount must be positive");
  }

  // Vérification simplifiée : montant disponible
  if (amount > 10000) { // limite fictive, en vrai tu checks en DB
    throw new Error("Insufficient funds");
  }

  // Mise à jour des comptes
  await patchAccount(fromAccountId, -amount); // débit
  await patchAccount(toAccountId, amount);   // crédit

  // Création du transfert
  return await createTransferInRepository(data);
}

export async function getTransfers(userId) {
  if (!userId) {
    throw new Error("Missing userId");
  }
  return await getTransfersFromRepository(userId);
}
