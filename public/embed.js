(function () {
  const BOT_URL = 'https://agreeable-sea-0ba7bfe00.7.azurestaticapps.net/'

  const css = `
    #zn-launcher {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 2147483640;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 0 20px 0 16px;
      height: 48px;
      background: linear-gradient(135deg, #E91E8C, #9333EA);
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: 'Outfit', 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      box-shadow: 0 8px 24px rgba(233,30,140,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    #zn-launcher:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 32px rgba(233,30,140,0.6);
    }
    #zn-launcher:active { transform: scale(0.96); }
    .zn-dot {
      position: absolute;
      top: 8px; right: 10px;
      width: 9px; height: 9px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid rgba(233,30,140,0.5);
      animation: znDotPulse 2s ease-in-out infinite;
    }
    @keyframes znDotPulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.35); opacity: 0.7; }
    }
    #zn-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 2147483641;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease;
      backdrop-filter: blur(4px);
    }
    #zn-overlay.zn-open { opacity: 1; pointer-events: all; }
    #zn-popup {
      position: fixed;
      bottom: 90px; right: 28px;
      width: 420px; height: 680px;
      z-index: 2147483642;
      border-radius: 20px;
      overflow: hidden;
      border: none;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(233,30,140,0.2);
      opacity: 0; pointer-events: none;
      transform: scale(0.92) translateY(20px);
      transform-origin: bottom right;
      transition:
        opacity 0.3s cubic-bezier(0.4,0,0.2,1),
        transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    #zn-popup.zn-open {
      opacity: 1; pointer-events: all;
      transform: scale(1) translateY(0);
    }
    @media (max-width: 500px) {
      #zn-popup {
        width: 100vw; height: 100dvh;
        bottom: 0; right: 0;
        border-radius: 0;
        transform-origin: bottom center;
      }
      #zn-launcher { bottom: 18px; right: 18px; }
    }
  `

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  const overlay = document.createElement('div')
  overlay.id = 'zn-overlay'
  document.body.appendChild(overlay)

  const popup = document.createElement('iframe')
  popup.id    = 'zn-popup'
  popup.title = 'ZILLIONe Digital Assistant'
  popup.allow = 'microphone; geolocation'
  document.body.appendChild(popup)

  const launcher = document.createElement('button')
  launcher.id = 'zn-launcher'
  launcher.setAttribute('aria-label', 'Open ZILLIONe Assistant')
  launcher.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span id="zn-label">Ask ZILLIONe</span>
    <span class="zn-dot"></span>
  `
  document.body.appendChild(launcher)

  let isOpen = false, hasLoaded = false

  function open() {
    if (!hasLoaded) { popup.src = BOT_URL; hasLoaded = true }
    isOpen = true
    popup.classList.add('zn-open')
    overlay.classList.add('zn-open')
    launcher.querySelector('#zn-label').textContent = 'Close'
    launcher.querySelector('.zn-dot').style.display = 'none'
  }

  function close() {
    isOpen = false
    popup.classList.remove('zn-open')
    overlay.classList.remove('zn-open')
    launcher.querySelector('#zn-label').textContent = 'Ask ZILLIONe'
    launcher.querySelector('.zn-dot').style.display = 'block'
  }

  launcher.addEventListener('click', () => isOpen ? close() : open())
  overlay.addEventListener('click', close)
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close() })
})()