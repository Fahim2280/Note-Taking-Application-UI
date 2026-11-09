import React, { useState, useEffect } from 'react';
import {
  getNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
  getNoteByIdApi
} from '../api/notes.api';
import Pagination from './Pagination';

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creating, setCreating] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Single note modal/view state
  const [activeModalNote, setActiveModalNote] = useState(null);
  const [loadingSingle, setLoadingSingle] = useState(false);

  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getNotesApi(page, 5);
      setNotes(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1);
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await createNoteApi({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      setSuccess('Note created successfully!');
      fetchNotes(1);
    } catch (err) {
      setError(err.message || 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSavingEdit(true);
    setError('');
    setSuccess('');

    try {
      await updateNoteApi(id, { title: editTitle.trim(), content: editContent.trim() });
      setEditingId(null);
      setSuccess('Note updated successfully!');
      fetchNotes(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to update note');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setError('');
    setSuccess('');
    try {
      await deleteNoteApi(id);
      setSuccess('Note deleted successfully!');
      fetchNotes(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    }
  };

  const handleViewSingle = async (id) => {
    setLoadingSingle(true);
    setError('');
    try {
      const res = await getNoteByIdApi(id);
      setActiveModalNote(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch note details');
    } finally {
      setLoadingSingle(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>My Personal Notes</h2>
        <p className="text-muted">Create, manage, and inspect your private notes.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Create Note Section */}
      <div className="card form-card">
        <h3>Create New Note</h3>
        <form onSubmit={handleCreateNote}>
          <div className="form-field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              required
              placeholder="e.g. Sprint Architecture Goals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              rows={3}
              required
              placeholder="Write your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? 'Saving...' : '+ Add Note'}
          </button>
        </form>
      </div>

      {/* Notes List Section */}
      <div className="card list-card">
        <div className="list-card-header">
          <h3>Your Notes</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchNotes(pagination.page)}
            disabled={loading}
          >
            &#8635; Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">No notes found. Create your first note above!</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Title</th>
                  <th style={{ width: '40%' }}>Content</th>
                  <th style={{ width: '15%' }}>Created</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => {
                  const isEditing = editingId === note._id;

                  return (
                    <tr key={note._id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        ) : (
                          <strong>{note.title}</strong>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                        ) : (
                          <span className="truncate-text">{note.content}</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleSaveEdit(note._id)}
                              disabled={savingEdit}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewSingle(note._id)}
                              title="View single note modal"
                            >
                              View
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => startEdit(note)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(note._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pagination={pagination}
          onPageChange={(newPage) => fetchNotes(newPage)}
        />
      </div>

      {/* View Single Modal */}
      {activeModalNote && (
        <div className="modal-backdrop" onClick={() => setActiveModalNote(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Note Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setActiveModalNote(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>ID:</strong> <code>{activeModalNote._id}</code>
              </p>
              <p>
                <strong>Title:</strong> {activeModalNote.title}
              </p>
              <p>
                <strong>Content:</strong>
              </p>
              <div className="note-content-box">{activeModalNote.content}</div>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(activeModalNote.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveModalNote(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
