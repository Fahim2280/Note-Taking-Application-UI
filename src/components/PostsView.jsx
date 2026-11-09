import React, { useState, useEffect } from 'react';
import { getPostsApi, createPostApi, getUserPostsWithLookupApi } from '../api/posts.api';
import { useAuth } from '../context/AuthContext';
import Pagination from './Pagination';

export default function PostsView({ prefilledUserId }) {
  const { user } = useAuth();

  // Public posts state
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Create post state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [creating, setCreating] = useState(false);

  // Scenario 2 ($lookup aggregation) state
  const [targetUserId, setTargetUserId] = useState(prefilledUserId || user?._id || '');
  const [scenario2Result, setScenario2Result] = useState(null);
  const [scenario2Loading, setScenario2Loading] = useState(false);
  const [scenario2Error, setScenario2Error] = useState('');

  // General feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPublicPosts = async (page = 1) => {
    setLoadingPosts(true);
    setError('');
    try {
      const res = await getPostsApi(page, 5);
      setPosts(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch public posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPublicPosts(1);
  }, []);

  useEffect(() => {
    if (prefilledUserId) {
      setTargetUserId(prefilledUserId);
      handleRunScenario2(prefilledUserId);
    }
  }, [prefilledUserId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await createPostApi({
        title: postTitle.trim(),
        content: postContent.trim()
      });

      setPostTitle('');
      setPostContent('');
      setSuccess('Post published to public feed!');
      fetchPublicPosts(1);
    } catch (err) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setCreating(false);
    }
  };

  const handleRunScenario2 = async (customId) => {
    const idToQuery = customId || targetUserId;
    if (!idToQuery || !idToQuery.trim()) {
      setScenario2Error('Please enter a valid User ID');
      return;
    }

    setScenario2Loading(true);
    setScenario2Error('');
    setScenario2Result(null);

    try {
      const res = await getUserPostsWithLookupApi(idToQuery.trim());
      setScenario2Result(res.data);
    } catch (err) {
      setScenario2Error(err.message || 'Failed to retrieve user with $lookup posts');
    } finally {
      setScenario2Loading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Posts & Scenario 2 ($lookup Aggregation)</h2>
        <p className="text-muted">
          Browse public posts and test the single aggregation pipeline ($lookup) joining User profiles with their posts.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Scenario 2 Interactive Tester Box */}
      <div className="card scenario-card">
        <div className="scenario-header">
          <span className="badge badge-accent">SCENARIO 2</span>
          <h3>User with Posts Aggregation ($lookup)</h3>
        </div>
        <p className="text-muted" style={{ marginBottom: '12px' }}>
          Executes a single MongoDB aggregation pipeline with <code>$lookup</code> to join user profile details and their populated posts collection.
        </p>

        <div className="scenario-search-bar">
          <input
            type="text"
            placeholder="Enter MongoDB User _id"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTargetUserId(user?._id || '')}
            title="Fill with my current User ID"
          >
            Use My ID
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleRunScenario2()}
            disabled={scenario2Loading}
          >
            {scenario2Loading ? 'Executing $lookup...' : 'Run Scenario 2'}
          </button>
        </div>

        {scenario2Error && <div className="alert alert-error">{scenario2Error}</div>}

        {scenario2Result && (
          <div className="scenario-result-box">
            <div className="profile-summary">
              <h4>Joined User Profile</h4>
              <div className="profile-grid">
                <div>
                  <strong>User ID:</strong> <code>{scenario2Result._id}</code>
                </div>
                <div>
                  <strong>Name:</strong> {scenario2Result.name}
                </div>
                <div>
                  <strong>Email:</strong> {scenario2Result.email}
                </div>
                <div>
                  <strong>Role:</strong>{' '}
                  <span className={`role-badge ${scenario2Result.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                    {scenario2Result.role}
                  </span>
                </div>
                <div>
                  <strong>Interests:</strong>{' '}
                  {scenario2Result.interests && scenario2Result.interests.length > 0
                    ? scenario2Result.interests.join(', ')
                    : 'None specified'}
                </div>
                <div>
                  <strong>Total Posts Joined:</strong>{' '}
                  <strong>{scenario2Result.posts ? scenario2Result.posts.length : 0}</strong>
                </div>
              </div>
            </div>

            <div className="lookup-posts-list">
              <h4>Joined Posts (from $lookup)</h4>
              {(!scenario2Result.posts || scenario2Result.posts.length === 0) ? (
                <div className="empty-state">This user has not authored any posts yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Post Title</th>
                        <th>Body / Content</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenario2Result.posts.map((p) => (
                        <tr key={p._id}>
                          <td><strong>{p.title}</strong></td>
                          <td><span className="truncate-text">{p.body || p.content}</span></td>
                          <td>
                            <span className={`badge ${p.status === 'published' ? 'badge-success' : 'badge-secondary'}`}>
                              {p.status || 'published'}
                            </span>
                          </td>
                          <td><small className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Public Post Form */}
      <div className="card form-card">
        <h3>Publish New Post</h3>
        <form onSubmit={handleCreatePost}>
          <div className="form-field">
            <label htmlFor="post-title">Post Title</label>
            <input
              id="post-title"
              type="text"
              required
              placeholder="e.g. Clean Architecture in Node.js"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="post-content">Post Body / Content</label>
            <textarea
              id="post-content"
              rows={3}
              required
              placeholder="Write your article or thoughts here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? 'Publishing...' : '+ Publish Post'}
          </button>
        </form>
      </div>

      {/* Public Posts Feed */}
      <div className="card list-card">
        <div className="list-card-header">
          <h3>Public Posts Feed</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchPublicPosts(pagination.page)}
            disabled={loadingPosts}
          >
            &#8635; Refresh Feed
          </button>
        </div>

        {loadingPosts ? (
          <div className="loading-state">Loading public feed...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">No public posts found. Publish one above!</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Title</th>
                  <th style={{ width: '40%' }}>Content</th>
                  <th style={{ width: '20%' }}>Author ID</th>
                  <th style={{ width: '15%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const authorObj = typeof post.authorId === 'object' && post.authorId !== null ? post.authorId : null;
                  const authorIdStr = authorObj ? authorObj._id : String(post.authorId || '');
                  const authorName = authorObj ? authorObj.name : null;
                  const authorEmail = authorObj ? authorObj.email : null;

                  return (
                    <tr key={post._id}>
                      <td><strong>{post.title}</strong></td>
                      <td><span className="truncate-text">{post.body || post.content}</span></td>
                      <td>
                        {authorName ? (
                          <div>
                            <strong>{authorName}</strong>
                            <div><small className="text-muted">{authorEmail}</small></div>
                          </div>
                        ) : (
                          <code>{authorIdStr}</code>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setTargetUserId(authorIdStr);
                            handleRunScenario2(authorIdStr);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="Query this author via Scenario 2 $lookup"
                        >
                          $lookup Author
                        </button>
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
          onPageChange={(newPage) => fetchPublicPosts(newPage)}
        />
      </div>
    </div>
  );
}
