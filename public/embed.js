(function () {
  const BOT_URL = 'https://agreeable-sea-0ba7bfe00.7.azurestaticapps.net/'
  const BRAND   = { magenta: '#E91E8C', purple: '#9333EA' }

  const css = `
    #zn-launcher {
      position: fixed; bottom: 28px; right: 28px; z-index: 99999;
      display: flex; align-items: center; gap: 9px;
      padding: 0 20px 0 16px; height: 48px;
      background: linear-gradient(135deg, ${BRAND.magenta}, ${BRAND.purple});
      border: none; border-radius: 50px; cursor: pointer;
      font-family: 'Outfit', 'Segoe UI', sans-serif;
      font-size: 14px; font-weight: 600; color: #fff;
      box-shadow: 0 8px 24px rgba(233,30,140,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    #zn-launcher:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 32px rgba(233,30,140,0.6);
    }
    #zn-launcher .zn-dot {
      position: absolute; top: 8px; right: 10px;
      width: 9px; height: 9px; border-radius: 50%;
      background: #fff; border: 2px solid rgba(233,30,140,0.5);
      animation: znPulse 2s ease-in-out infinite;
    }
    @keyframes znPulse {
      0%,100%{ transform: scale(1); opacity: 1; }
      50%    { transform: scale(1.3); opacity: 0.7; }
    }
    #zn-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 99997; opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    #zn-overlay.open { opacity: 1; pointer-events: all; }
    #zn-panel {
      position: fixed; top: 0; right: -420px; width: 420px; height: 100vh;
      z-index: 99998; border: none;
      transition: right 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: -8px 0 40px rgba(0,0,0,0.5);
    }
    #zn-panel.open { right: 0; }
    @media (max-width: 480px) {
      #zn-panel { width: 100vw; right: -100vw; }
      #zn-launcher { bottom: 18px; right: 18px; }
    }
  `

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  const overlay = document.createElement('div')
  overlay.id = 'zn-overlay'
  document.body.appendChild(overlay)

  const panel = document.createElement('iframe')
  panel.id     = 'zn-panel'
  panel.src    = BOT_URL
  panel.title  = 'ZILLIONe Digital Assistant'
  panel.allow  = 'microphone; geolocation'
  document.body.appendChild(panel)

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

  let isOpen = false

  function open() {
    isOpen = true
    panel.classList.add('open')
    overlay.classList.add('open')
    launcher.querySelector('#zn-label').textContent = 'Close'
    launcher.querySelector('.zn-dot').style.display = 'none'
    launcher.style.paddingRight = '16px'
  }

  function close() {
    isOpen = false
    panel.classList.remove('open')
    overlay.classList.remove('open')
    launcher.querySelector('#zn-label').textContent = 'Ask ZILLIONe'
    launcher.querySelector('.zn-dot').style.display = 'block'
  }

  launcher.addEventListener('click', () => isOpen ? close() : open())
  overlay.addEventListener('click', close)
})()