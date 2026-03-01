import { useState } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import SplashScreen from './components/SplashScreen';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-black text-white selection:bg-white selection:text-black">
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <Layout onHomeClick={() => setHasStarted(false)}>
          <ChatInterface
            hasStarted={hasStarted}
            onStart={() => setHasStarted(true)}
            activePrompt={null}
            onPromptHandled={() => { }}
          />
        </Layout>
      )}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
