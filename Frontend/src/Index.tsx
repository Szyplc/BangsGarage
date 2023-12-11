import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: '#f5f5f5',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  description: {
    fontSize: '18px',
    marginBottom: '24px',
    color: '#666',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
    background: '#f50057',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

function Index() {
  return (
    <div>
      <h1 style={styles.title}>Bangs Garage</h1>
      <p style={styles.description}>Fajne auta nie mam dalej pomysłu</p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>
          Zaloguj się
        </Link>
        <Link to="/register" style={styles.button}>
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}

export default Index;
