import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'

const SPEED = 18 // ms per character — lower = faster

export default function StreamingBubble({ text, className }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    // Reset whenever a new message arrives
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    const id = setInterval(() => {
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, SPEED)

    return () => clearInterval(id)
  }, [text])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: marked.parse(displayed) }}
      data-streaming={!done}
    />
  )
}