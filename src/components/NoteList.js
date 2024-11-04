import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState('asc');
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchNotes(token);
    }
  }, [page, size, sort, direction]);

  const fetchNotes = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8082/api/v1/notes?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSort = (column) => {
    if (sort === column) {
      setDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(column);
      setDirection('asc');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:8082/api/v1/notes/${currentNote.id}`
      : 'http://localhost:8082/api/v1/notes';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: currentNote.title, content: currentNote.content }),
      });

      if (!response.ok) throw new Error('Failed to save note');
      fetchNotes(token);
      setCurrentNote(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (noteId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8082/api/v1/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const startCreating = () => {
    setCurrentNote({ title: '', content: '' });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const time = new Date(dateString).toLocaleTimeString('pl-PL', options);
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString).toLocaleDateString('pl-PL', dateOptions);
    return `${time} | ${date}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Notes</h2>
      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <>
          {totalElements === 0 ? (
            <p style={styles.noNotes}>No notes available.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={styles.header}>
                    Title {sort === 'title' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('content')} style={styles.header}>
                    Content {sort === 'content' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={styles.header}>
                    Created At {sort === 'createdAt' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={styles.header}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} style={styles.row}>
                    <td style={styles.cell}>{note.title}</td>
                    <td style={styles.cell}>
                      <div style={styles.contentCell}>
                        <span className="content-text" title={note.content}>
                          {note.content.length > 50 ? `${note.content.substring(0, 47)}...` : note.content}
                        </span>
                      </div>
                    </td>
                    <td style={styles.cell}>{formatDate(note.createdAt)}</td>
                    <td style={styles.cell}>
                      <button
                        onClick={() => startEditing(note)}
                        style={styles.editButton}
                        title="Edit Note"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        style={styles.deleteButton}
                        title="Delete Note"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={styles.pagination}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              style={{
                ...styles.pageButton,
                backgroundColor: page === 0 ? '#ccc' : '#3498db',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={styles.pageText}>
              Page {page + 1} of {totalPages > 0 ? totalPages : 1}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1 || totalPages === 0}
              style={{
                ...styles.pageButton,
                backgroundColor: page === totalPages - 1 || totalPages === 0 ? '#ccc' : '#3498db',
                cursor: page === totalPages - 1 || totalPages === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
          <button onClick={startCreating} style={styles.addButton}>Add New Note</button>
          {currentNote && (
            <form onSubmit={handleSave} style={styles.form}>
              <h2 style={styles.formHeading}>{isEditing ? 'Edit Note' : 'New Note'}</h2>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                style={styles.input}
              />
              <label style={styles.label}>Content</label>
              <textarea
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                style={styles.textarea}
              />
              <button type="submit" style={styles.saveButton}>Save</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
  },
  error: {
    color: '#e74c3c',
  },
  noNotes: {
    fontStyle: 'italic',
    color: '#555',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  header: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    borderRight: '1px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  cell: {
    padding: '10px',
    borderRight: '1px solid #ddd',
  },
  contentCell: {
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  editButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#2ecc71',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#e74c3c',
  },
  loading: {
    fontSize: '18px',
    color: '#3498db',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  pageButton: {
    padding: '8px 12px',
    fontSize: '14px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  pageText: {
    fontSize: '16px',
    color: '#555',
  },
  addButton: {
    marginTop: '20px',
    padding: '10px 15px',
    color: '#fff',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
  },
  formHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    resize: 'vertical',
    minHeight: '100px',
  },
  saveButton: {
    padding: '10px 15px',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NoteList;
