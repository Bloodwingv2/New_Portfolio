import { useState } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <Layout>
          <ChatInterface />
        </Layout>
      )}
    </div>
  );
}

export default App;
