import fs from 'fs/promises';
import path from 'path';
import Contact from '../db/models/contacts.js';

const __dirname = path.resolve();
const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  return Contact.findAll()
}

async function getContactById(contactId) {
  return Contact.findByPk(contactId)
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
}

async function updateContact(contactId, name = null, email = null, phone = null) {
  if (name === null && email === null && phone === null) {
    throw new Error('At least one field must be provided for update');
  }
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  if (!name) name = contact.name;
  if (!email) email = contact.email;
  if (!phone) phone = contact.phone;
  const updatedContact = await contact
    .update({ name, email, phone })
    .then(() => contact);
  return updatedContact;
}

async function updateStatusContact(contactId, favorite) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  contact.favorite = favorite;
  await contact.save();
  return contact;
}

export {listContacts, getContactById, removeContact, addContact, updateContact, updateStatusContact};
