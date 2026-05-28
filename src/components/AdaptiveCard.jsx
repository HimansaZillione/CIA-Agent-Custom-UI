import { useEffect, useRef } from 'react'
import * as AdaptiveCards from 'adaptivecards'

export default function AdaptiveCard({ cardJson, onSubmit }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!cardJson || !ref.current) return
    const card = new AdaptiveCards.AdaptiveCard()
    card.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "'DM Sans', sans-serif",
      fontSizes: { default: 13, medium: 13, large: 15 },
      containerStyles: {
        default: { backgroundColor: 'transparent', foregroundColors: { default: { default: '#F5F5DC', subtle: '#B0B0B0' } } }
      },
      actions: { actionAlignment: 'stretch', buttonSpacing: 8 },
    })
    card.parse(cardJson)
    card.onExecuteAction = (action) => {
      if (action instanceof AdaptiveCards.SubmitAction && onSubmit) onSubmit(action.data)
      if (action instanceof AdaptiveCards.OpenUrlAction) window.open(action.url, '_blank', 'noopener')
    }
    ref.current.innerHTML = ''
    ref.current.appendChild(card.render())
  }, [cardJson, onSubmit])

  return <div ref={ref} className="adaptive-card-wrap" />
}