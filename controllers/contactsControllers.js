import * as contactsServices from '../services/contactsServices.js';

export const getAllContacts = (req, res) => {
  const { id: owner } = req.user;
  contactsServices.listContacts(owner)
    .then((contacts) => {
      contacts = contacts.map(({ id, name, email, phone, favorite }) => ({
        id,
        name,
        email,
        phone,
        favorite,
      }));
      res.status(200).json(contacts);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    });
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  contactsServices.getContactById(owner, id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: 'Not found' });
      }
      contact = {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        favorite: contact.favorite,
      }
      res.status(200).json(contact);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch contact' });
    });
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  contactsServices.removeContact(owner, id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.status(200).json(contact);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete contact' });
    });
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  const { id: owner } = req.user;
  contactsServices.addContact(owner, name, email, phone)
    .then((newContact) => {
      res.status(201).json(newContact);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create contact' });
    });
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { id: owner } = req.user;
  contactsServices
    .updateContact(
      owner, id, name !== undefined ? name : null,
      email !== undefined ? email : null,
      phone !== undefined ? phone : null)
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ error: 'Not found' });
      }
      updatedContact = {
        id: updatedContact.id,
        name: updatedContact.name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        favorite: updatedContact.favorite,
      }
      res.status(200).json(updatedContact);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update contact' });
    });
};

export const updateStatusContact = (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { id: owner } = req.user;
  contactsServices.updateStatusContact(owner, id, favorite)
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ error: 'Not found' });
      }
      updatedContact = {
        id: updatedContact.id,
        name: updatedContact.name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        favorite: updatedContact.favorite,
      }
      res.status(200).json(updatedContact);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update contact' });
    });
};
