const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://shravya:aaravdas@cluster0.te7ub.mongodb.net/eventDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
    name: String,
    regno: String,
    department: String
});
const Student = mongoose.model('Student', studentSchema);

// API to get all students (READ)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find(); // No callback needed, returns a Promise
        res.json(students);
    } catch (err) {
        res.status(500).send(err);
    }
});

// API to add a new student (CREATE)
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save(); // No callback, returns a Promise
        res.json(savedStudent);
    } catch (err) {
        res.status(500).send(err);
    }
});

// API to update an existing student (UPDATE)
app.put('/api/students/:id', (req, res) => {
    console.log('Updating student:', req.params.id, req.body);
    Student.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, student) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).send(err);
        }
        res.json(student);
    });
});


// API to delete a student (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).send("Student not found");
        res.json({ message: 'Student deleted', student: deletedStudent });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
