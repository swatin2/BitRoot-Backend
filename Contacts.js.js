app.post('/contacts', upload.single('image'), (req, res) => {
    const { name, number } = req.body;
    const imagePath = req.file ? req.file.path : '';

    db.run(`INSERT INTO contacts (name, image) VALUES (?, ?)`, [name, imagePath], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const contactId = this.lastID;
        db.run(`INSERT INTO phone_numbers (contact_id, number) VALUES (?, ?)`, [contactId, number], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Contact created successfully' });
        });
    });
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
    const contactId = req.params.id;

    db.run(`DELETE FROM phone_numbers WHERE contact_id = ?`, [contactId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        db.run(`DELETE FROM contacts WHERE id = ?`, [contactId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Contact deleted successfully' });
        });
    });
});