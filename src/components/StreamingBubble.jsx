import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'

const SPEED = 18 // ms per character — lower = faster

// Messages that have already finished typing out. If a bubble is mounted again
// (e.g. after switching views), it shows the full text instead of re-typing it.
const finished = new Set()

export default function StreamingBubble({ id, text, className }) {
  const already = id != null && finished.has(id)
  const [displayed, setDisplayed] = useState(already ? text : '')
  const [done, setDone] = useState(already)
  const indexRef = useRef(0)

  useEffect(() => {
    if (id != null && finished.has(id)) {
      setDisplayed(text)
      setDone(true)
      return
    }

    // Reset whenever a new message arrives
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    const timer = setInterval(() => {
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(timer)
        setDone(true)
        if (id != null) finished.add(id)
      }
    }, SPEED)

    return () => clearInterval(timer)
  }, [id, text])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: marked.parse(displayed) }}
      data-streaming={!done}
    />
  )
}