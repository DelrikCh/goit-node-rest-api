import fs from 'fs/promises';

import Contact from '../db/models/contacts.js';

async function listContacts(owner) {
  return Contact.findAll({
    where: { owner },
  });
}

async function getContactById(owner, contactId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner,
    },
  });
  if (!contact) {
    return null;
  }
  return contact;
}

async function removeContact(owner, contactId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner,
    },
  });
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function addContact(owner, name, email, phone) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner,
  });
  return newContact;
}

async function updateContact(
  owner, contactId, name = null, email = null, phone = null) {
  if (name === null && email === null && phone === null) {
    throw new Error('At least one field must be provided for update');
  }
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner,
    },
  });
  if (!contact) {
    return null;
  }
  if (!name) name = contact.name;
  if (!email) email = contact.email;
  if (!phone) phone = contact.phone;
  const updatedContact =
    await contact.update({ name, email, phone }).then(() => contact);
  return updatedContact;
}

async function updateStatusContact(owner, contactId, favorite) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner,
    },
  });
  if (!contact) {
    return null;
  }
  contact.favorite = favorite;
  await contact.save();
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
