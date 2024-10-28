import React, { useState, useEffect } from 'react';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState('asc');

  useEffect(() => {
    fetchNotes();
  }, [page, size, sort, direction]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8082/notes?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
        {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.content); // assumes API sends paginated notes as `content`
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Notes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>Created at: {new Date(note.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination Controls */}
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          Previous
        </button>
        <span> Page {page + 1} </span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}

export default NoteList;
