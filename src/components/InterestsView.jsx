import React, { useState, useEffect } from 'react';
import { getUsersByInterestsApi } from '../api/users.api';
import Pagination from './Pagination';

export default function InterestsView({ onSelectUserForLookup }) {
  const [interestGroups, setInterestGroups] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInterests = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsersByInterestsApi(page, 5);
      setInterestGroups(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch interest aggregation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests(1);
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2>Scenario 1: Group Users by Interests</h2>
          <span className="badge badge-accent">SCENARIO 1</span>
        </div>
        <p className="text-muted">
          Executed via exactly <strong>one</strong> MongoDB aggregation pipeline using <code>$unwind</code>, <code>$group</code>, and <code>$facet</code> with zero extra database queries.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card list-card">
        <div className="list-card-header">
          <h3>Interest Clusters</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchInterests(pagination.page)}
            disabled={loading}
          >
            &#8635; Refresh Aggregation
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Running single aggregation query ($facet)...</div>
        ) : interestGroups.length === 0 ? (
          <div className="empty-state">
            No interests grouped yet. Register users with interests (e.g. "coding, ai, mongodb") to populate this view.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Interest Tag (_id)</th>
                  <th style={{ width: '15%' }}>User Count</th>
                  <th style={{ width: '60%' }}>Associated Users</th>
                </tr>
              </thead>
              <tbody>
                {interestGroups.map((group) => (
                  <tr key={group._id}>
                    <td>
                      <span className="interest-tag">&#127991; {group._id}</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{group.count} user{group.count !== 1 ? 's' : ''}</span>
                    </td>
                    <td>
                      <div className="user-chips-container">
                        {group.users && group.users.map((u) => (
                          <div key={u._id} className="user-chip">
                            <span className="user-chip-name">{u.name}</span>
                            <span className="user-chip-email">&lt;{u.email}&gt;</span>
                            <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-user'}`} style={{ fontSize: '10px', padding: '1px 5px' }}>
                              {u.role}
                            </span>
                            {onSelectUserForLookup && (
                              <button
                                className="chip-lookup-btn"
                                onClick={() => onSelectUserForLookup(u._id)}
                                title="Inspect this user in Scenario 2 ($lookup)"
                              >
                                $lookup &rarr;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pagination={pagination}
          onPageChange={(newPage) => fetchInterests(newPage)}
        />
      </div>
    </div>
  );
}
