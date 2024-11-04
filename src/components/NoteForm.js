import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNote, updateNote } from '../api';

const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) fetchNote();
  }, [id]);

  const fetchNote = async () => {
    const note = await getNote(id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateNote(id, { title, content });
    } else {
      await createNote({ title, content });
    }
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h1 style={styles.heading}>{id ? 'Edit Note' : 'New Note'}</h1>
      <label style={styles.label}>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={styles.input}
      />
      <label style={styles.label}>Content</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        style={styles.textarea}
      />
      <button type="submit" style={styles.saveButton}>Save</button>
    </form>
  );
};

const styles = {
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '15px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '150px',
    marginBottom: '20px',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.3s',
  },
  saveButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default NoteForm;
