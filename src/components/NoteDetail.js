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

  if (!note) return <p>Loading...</p>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <button onClick={() => navigate(`/notes/edit/${id}`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default NoteDetail;
