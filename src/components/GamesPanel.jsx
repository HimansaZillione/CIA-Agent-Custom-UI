import { useState } from 'react'
import TicTacToe from './games/TicTacToe'
import FlappyBird from './games/FlappyBird'
import Snake from './games/Snake'

export default function GamesPanel({ visible }) {
  const [tab, setTab] = useState('ttt')

  return (
    <div className={`games-panel${visible ? '' : ' hidden'}`}>
      <div className="games-header">
        <p>🎮 Mini Games</p>
        <div className="game-tabs">
          <button className={`tab-btn${tab==='ttt'    ? ' active' : ''}`} onClick={() => setTab('ttt')}>Tic Tac Toe</button>
          <button className={`tab-btn${tab==='flappy' ? ' active' : ''}`} onClick={() => setTab('flappy')}>Flappy Bird</button>
          <button className={`tab-btn${tab==='snake'  ? ' active' : ''}`} onClick={() => setTab('snake')}>Snake</button>
        </div>
      </div>
      <div className="game-container">
        <div className={`game-view${tab==='ttt' ? ' active' : ''}`}>
          <div style={{ height: 10 }} />
          <TicTacToe />
        </div>
        <div className={`game-view${tab==='flappy' ? ' active' : ''}`}>
          <div style={{ height: 10 }} />
          <FlappyBird active={tab==='flappy'} />
        </div>
        <div className={`game-view${tab==='snake' ? ' active' : ''}`}>
          <div style={{ height: 10 }} />
          <Snake active={tab==='snake'} />
        </div>
      </div>
    </div>
  )
}
