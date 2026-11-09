import React, { useState, useEffect } from 'react';
import {
  getAdminUsersApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  getAdminNotesApi
} from '../api/admin.api';
import Pagination from './Pagination';

export default function AdminView({ onSelectUserForLookup }) {
  // Section A: Users state
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Add User state
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState('User');
  const [addInterests, setAddInterests] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  // Edit User state
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('User');
  const [editInterests, setEditInterests] = useState('');
  const [savingUserEdit, setSavingUserEdit] = useState(false);

  // Section B: All Notes state
  const [allNotes, setAllNotes] = useState([]);
  const [notesPagination, setNotesPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Global feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async (page = 1) => {
    setLoadingUsers(true);
    try {
      const res = await getAdminUsersApi(page, 5);
      setUsers(res.data || []);
      if (res.pagination) setUserPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load users for administration');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllNotes = async (page = 1) => {
    setLoadingNotes(true);
    try {
      const res = await getAdminNotesApi(page, 5);
      setAllNotes(res.data || []);
      if (res.pagination) setNotesPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load all notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchAllNotes(1);
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPassword) return;

    setAddingUser(true);
    setError('');
    setSuccess('');

    const parsedInterests = addInterests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      await createAdminUserApi({
        name: addName.trim(),
        email: addEmail.trim(),
        password: addPassword,
        role: addRole,
        interests: parsedInterests
      });

      setAddName('');
      setAddEmail('');
      setAddPassword('');
      setAddInterests('');
      setAddRole('User');
      setSuccess('New user account added successfully by Admin!');
      fetchUsers(1);
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setAddingUser(false);
    }
  };

  const startEditUser = (u) => {
    setEditingUserId(u._id);
    setEditName(u.name);
    setEditRole(u.role);
    setEditInterests(Array.isArray(u.interests) ? u.interests.join(', ') : '');
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setEditName('');
    setEditRole('User');
    setEditInterests('');
  };

  const handleSaveUserEdit = async (userId) => {
    setSavingUserEdit(true);
    setError('');
    setSuccess('');

    const parsedInterests = editInterests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      await updateAdminUserApi(userId, {
        name: editName.trim(),
        role: editRole,
        interests: parsedInterests
      });

      setEditingUserId(null);
      setSuccess('User updated successfully!');
      fetchUsers(userPagination.page);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSavingUserEdit(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    setError('');
    setSuccess('');
    try {
      await deleteAdminUserApi(userId);
      setSuccess('User deleted successfully!');
      fetchUsers(userPagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2>Admin Control Center</h2>
          <span className="role-badge role-admin">RESTRICTED TO ADMINS</span>
        </div>
        <p className="text-muted">
          Manage system users and inspect all notes across the entire application with Role-Based Access Control (RBAC).
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* SECTION A: Manage All Users */}
      <div className="card form-card" style={{ marginBottom: '24px' }}>
        <h3>Section A: Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div className="form-grid-3">
            <div className="form-field">
              <label htmlFor="admin-name">Full Name</label>
              <input
                id="admin-name"
                type="text"
                required
                placeholder="Bob Smith"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="bob@example.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="admin-interests">Interests (comma-separated)</label>
              <input
                id="admin-interests"
                type="text"
                placeholder="docker, kubernetes, go"
                value={addInterests}
                onChange={(e) => setAddInterests(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-role">Assign Role</label>
              <select
                id="admin-role"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={addingUser}>
            {addingUser ? 'Creating User...' : '+ Add User via Admin'}
          </button>
        </form>
      </div>

      <div className="card list-card" style={{ marginBottom: '32px' }}>
        <div className="list-card-header">
          <h3>Manage All Registered Users</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchUsers(userPagination.page)}
            disabled={loadingUsers}
          >
            &#8635; Refresh Users
          </button>
        </div>

        {loadingUsers ? (
          <div className="loading-state">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users registered in database.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Name</th>
                  <th style={{ width: '25%' }}>Email</th>
                  <th style={{ width: '12%' }}>Role</th>
                  <th style={{ width: '23%' }}>Interests</th>
                  <th style={{ width: '20%' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isEditing = editingUserId === u._id;

                  return (
                    <tr key={u._id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        ) : (
                          <strong>{u.name}</strong>
                        )}
                      </td>
                      <td>
                        <code>{u.email}</code>
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            placeholder="comma-separated"
                            value={editInterests}
                            onChange={(e) => setEditInterests(e.target.value)}
                          />
                        ) : (
                          <span>
                            {u.interests && u.interests.length > 0
                              ? u.interests.join(', ')
                              : 'None'}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleSaveUserEdit(u._id)}
                              disabled={savingUserEdit}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={cancelEditUser}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                if (onSelectUserForLookup) {
                                  onSelectUserForLookup(u._id);
                                }
                              }}
                              title="Inspect this user's posts via Scenario 2 ($lookup)"
                            >
                              $lookup Posts
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => startEditUser(u)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteUser(u._id)}
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
          pagination={userPagination}
          onPageChange={(newPage) => fetchUsers(newPage)}
        />
      </div>

      {/* SECTION B: View Everyone's Notes */}
      <div className="card list-card">
        <div className="list-card-header">
          <h3>Section B: Global Notes Master View</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchAllNotes(notesPagination.page)}
            disabled={loadingNotes}
          >
            &#8635; Refresh Notes
          </button>
        </div>

        {loadingNotes ? (
          <div className="loading-state">Loading global notes...</div>
        ) : allNotes.length === 0 ? (
          <div className="empty-state">No notes found across any accounts.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Note Title</th>
                  <th style={{ width: '35%' }}>Content Snippet</th>
                  <th style={{ width: '25%' }}>Owner Details</th>
                  <th style={{ width: '15%' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {allNotes.map((n) => (
                  <tr key={n._id}>
                    <td><strong>{n.title}</strong></td>
                    <td><span className="truncate-text">{n.content}</span></td>
                    <td>
                      <div>
                        {n.owner ? (
                          <>
                            <strong>{n.owner.name}</strong>
                            <div><small className="text-muted">{n.owner.email}</small></div>
                          </>
                        ) : (
                          <code>{n.userId}</code>
                        )}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pagination={notesPagination}
          onPageChange={(newPage) => fetchAllNotes(newPage)}
        />
      </div>
    </div>
  );
}
