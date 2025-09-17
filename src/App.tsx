import React, { useState, useEffect } from 'react';
import './App.css';

// Tipagem para os posts
interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// Tipagem para os usuários fake
interface User {
  id: number;
  name: string;
  email: string;
}

// Tipagem para os comentários
interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Usuários mockados
const users: User[] = [
  { id: 8, name: "Lucas Andrade", email: "lucas.andrade@example.com" },
  { id: 1, name: "Maria Souza", email: "maria.souza@example.com" },
  { id: 2, name: "Rafael Lima", email: "rafael.lima@example.com" },
  { id: 3, name: "Fernanda Oliveira", email: "fernanda.oliveira@example.com" },
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Puxa posts e comentários em paralelo
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

  if (loading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">Carregando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p className="error-text">Erro ao buscar dados: {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="main-title">Blog Posts - JSONPlaceholder</h1>
        <div className="posts-grid">
          {posts.map((post) => {
            const user = users.find(u => u.id === post.userId);

            // Filtra comentários para esse post
            const postComments = comments.filter(c => c.postId === post.id);

            return (
              <div key={post.id} className="post-card">
                {/* Nome do Usuário + "diz:" */}
                <h2 className="post-author">
                  {user ? `${user.name} diz:` : "Usuário desconhecido diz:"}
                </h2>

                <h3 className="post-title">{post.title}</h3>

                <p className="post-body">{post.body}</p>

                {/* Lista de comentários */}
                <div className="comments-section">
                  <h4>Comentários:</h4>
                  {postComments.length > 0 ? (
                    <ul>
                      {postComments.map((comment) => (
                        <li key={comment.id}>
                          <p><strong>{comment.name}</strong> ({comment.email})</p>
                          <p>{comment.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sem comentários</p>
                  )}
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
