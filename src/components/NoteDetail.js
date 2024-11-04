import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, deleteNote } from '../api';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    const data = await getNote(id);
    setNote(data);
  };

  const handleDelete = async () => {
    await deleteNote(id);
    navigate('/');
  };

  if (!note) return <p style={styles.loadingText}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{note.title}</h1>
      <p style={styles.content}>{note.content}</p>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate(`/notes/edit/${id}`)} style={styles.editButton}>Edit</button>
        <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default NoteDetail;
