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

// Usuários mockados
const users: User[] = [
  { id: 8, name: "Lucas Andrade", email: "lucas.andrade@example.com" },
  { id: 1, name: "Maria Souza", email: "maria.souza@example.com" },
  { id: 2, name: "Rafael Lima", email: "rafael.lima@example.com" },
  { id: 3, name: "Fernanda Oliveira", email: "fernanda.oliveira@example.com" },
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
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
    fetchPosts();
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
        <h1 className="main-title">
          Blog Posts - JSONPlaceholder
        </h1>
        <div className="posts-grid">
          {posts.map((post) => {
            const user = users.find(u => u.id === post.userId);
            return (
              <div key={post.id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-body">{post.body}</p>
                {user ? (
                  <div className="user-id-badge">
                    <strong>Usuário:</strong>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                  </div>
                ) : (
                  <div className="user-id-badge">
                    <strong>Usuário:</strong>
                    <p>Desconhecido</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;