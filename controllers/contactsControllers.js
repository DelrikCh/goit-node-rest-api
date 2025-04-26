import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
  contactsServices
    .listContacts()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch contacts" });
    });
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  contactsServices
    .getContactById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch contact" });
    });
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  contactsServices
    .removeContact(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete contact" });
    });
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  contactsServices
    .addContact( name, email, phone )
    .then((newContact) => {
      res.status(201).json(newContact);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create contact" });
    });
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  contactsServices
    .updateContact(
      id,
      name !== undefined ? name : null,
      email !== undefined ? email : null,
      phone !== undefined ? phone : null
    )
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ error: "Not found" });
      }
      res.status(200).json(updatedContact);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update contact" });
    });
};

export const updateStatusContact = (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  contactsServices
    .updateStatusContact(id, favorite)
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ error: "Not found" });
      }
      res.status(200).json(updatedContact);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update contact" });
    });
};
