import Layout from './components/Layout'
import ChatInterface from './components/ChatInterface'

function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Layout>
        <ChatInterface />
      </Layout>
    </div>
  )
}

export default App
