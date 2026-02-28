import './App.css'
import Balatro from './components/balatro/balatro.tsx';

function App() {
  return (
<div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden',
      backgroundColor: '#0d1b1e'
    }}>
      <Balatro 
        isRotate={false} 
        mouseInteraction={true} 
        pixelFilter={800} 
        color1="#0d1b1e" 
        color2="#c0a080" 
        color3="#2f4f4f"
      />
    </div>
  )
}

export default App
