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
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit Note' : 'New Note'}</h1>
      <label>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <label>Content</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
};

export default NoteForm;
