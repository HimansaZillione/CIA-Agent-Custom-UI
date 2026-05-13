import { useState, useCallback } from 'react'

const WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function checkWin(board) {
  for (const [a,b,c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a,b,c]
  }
  return null
}

function bestMove(board) {
  for (let i = 0; i < 9; i++) { if (!board[i]) { board[i]='O'; if (checkWin(board)) { board[i]=null; return i } board[i]=null } }
  for (let i = 0; i < 9; i++) { if (!board[i]) { board[i]='X'; if (checkWin(board)) { board[i]=null; return i } board[i]=null } }
  if (!board[4]) return 4
  const corners = [0,2,6,8].filter(c => !board[c])
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)]
  const free = [0,1,2,3,4,5,6,7,8].filter(c => !board[c])
  return free[Math.floor(Math.random()*free.length)]
}

export default function TicTacToe() {
  const [board, setBoard]   = useState(Array(9).fill(null))
  const [turn, setTurn]     = useState('X')
  const [over, setOver]     = useState(false)
  const [winLine, setWinLine] = useState(null)
  const [status, setStatus] = useState('Your turn — X')
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 })

  const endGame = useCallback((result, b) => {
    setOver(true)
    setScores(s => ({ ...s, [result]: s[result] + 1 }))
    if (result === 'X') setStatus('🎉 You win!')
    else if (result === 'O') setStatus('🤖 CPU wins!')
    else setStatus('🤝 Draw!')
  }, [])

  const cpuMove = useCallback((b) => {
    const m = bestMove([...b])
    const next = [...b]; next[m] = 'O'
    setBoard(next)
    const w = checkWin(next)
    if (w) { setWinLine(w); endGame('O', next) }
    else if (next.every(c => c)) endGame('D', next)
    else { setTurn('X'); setStatus('Your turn — X') }
  }, [endGame])

  const handleClick = useCallback((i) => {
    if (over || board[i] || turn !== 'X') return
    const next = [...board]; next[i] = 'X'
    setBoard(next)
    const w = checkWin(next)
    if (w) { setWinLine(w); endGame('X', next); return }
    if (next.every(c => c)) { endGame('D', next); return }
    setTurn('O'); setStatus('CPU thinking…')
    setTimeout(() => cpuMove(next), 450)
  }, [over, board, turn, endGame, cpuMove])

  const reset = () => {
    setBoard(Array(9).fill(null)); setTurn('X'); setOver(false)
    setWinLine(null); setStatus('Your turn — X')
  }

  return (
    <>
      <div className="score-row">
        <div className="score-box x"><div className="label">You (X)</div><div className="val">{scores.X}</div></div>
        <div className="score-box d"><div className="label">Draw</div><div className="val">{scores.D}</div></div>
        <div className="score-box o"><div className="label">CPU (O)</div><div className="val">{scores.O}</div></div>
      </div>
      <div className="ttt-status">{status}</div>
      <div className="ttt-grid">
        {board.map((v, i) => (
          <div
            key={i}
            className={`ttt-cell${v ? ' taken ' + v.toLowerCase() : ''}${winLine?.includes(i) ? ' win' : ''}`}
            onClick={() => handleClick(i)}
          >{v || ''}</div>
        ))}
      </div>
      <button className="ttt-reset" onClick={reset}>New Game</button>
    </>
  )
}
