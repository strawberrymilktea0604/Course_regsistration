import { useState } from 'react'
import './App.css'
import React from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello React with TypeScript</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          Count is: {count}
        </button>
      </header>
    </div>
  )
}

export default App