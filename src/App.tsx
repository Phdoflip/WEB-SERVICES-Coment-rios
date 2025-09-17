import React, { useState, useEffect } from 'react';
import './App.css';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const users: User[] = [
  { id: 8, name: "Lucas Andrade", email: "lucas.andrade@example.com" },
  { id: 1, name: "Maria Souza", email: "maria.souza@example.com" },
  { id: 2, name: "Rafael Lima", email: "rafael.lima@example.com" },
  { id: 3, name: "Fernanda Oliveira", email: "fernanda.oliveira@example.com" },
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const [postsResponse, commentsResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/comments'),
        ]);

        if (!postsResponse.ok || !commentsResponse.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const postsData: Post[] = await postsResponse.json();
        const commentsData: Comment[] = await commentsResponse.json();

        setPosts(postsData);
        setComments(commentsData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleComments = (postId: number) => {
    setExpandedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleAddComment = (postId: number, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      postId,
      name: "Você",
      email: "voce@example.com",
      body: text,
    };
    setComments(prev => [...prev, newComment]);
  };

  if (loading) {
    return <p>Carregando posts...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="main-title">Blog Posts - JSONPlaceholder</h1>
        <div className="posts-grid">
          {posts.map(post => {
            const user = users.find(u => u.id === post.userId);
            const postComments = comments.filter(c => c.postId === post.id);
            const isExpanded = expandedPosts.includes(post.id);
            const visibleComments = isExpanded
              ? postComments
              : postComments.slice(0, 3);

            return (
              <div key={post.id} className="post-card">
                {/* Nome do usuário */}
                <h2 className="post-author">
                  {user ? `${user.name} diz:` : "Usuário desconhecido diz:"}
                </h2>

                {/* Imagem do post */}
                <img
                  src={`https://picsum.photos/seed/${post.id}/400/200`}
                  alt="Imagem ilustrativa"
                  className="post-image"
                />

                {/* Título e corpo */}
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>

                {/* Comentários */}
                <div className="comments-section">
                  <h4>Comentários:</h4>
                  {visibleComments.length > 0 ? (
                    <ul>
                      {visibleComments.map(comment => (
                        <li key={comment.id}>
                          <p>
                            <strong>{comment.name} comenta:</strong>
                          </p>
                          <p>{comment.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sem comentários</p>
                  )}

                  {postComments.length > 3 && (
                    <button
                      className="toggle-btn"
                      onClick={() => toggleComments(post.id)}
                    >
                      {isExpanded ? "Ver menos" : "Ver mais comentários"}
                    </button>
                  )}

                  {/* Caixa para novo comentário */}
                  <div className="add-comment">
                    <textarea
                      placeholder="Escreva um comentário..."
                      id={`comment-${post.id}`}
                    />
                    <button
                      onClick={() => {
                        const textarea = document.getElementById(
                          `comment-${post.id}`
                        ) as HTMLTextAreaElement;
                        handleAddComment(post.id, textarea.value);
                        textarea.value = "";
                      }}
                    >
                      Comentar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
