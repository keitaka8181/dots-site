import React, { useEffect, useRef, useCallback } from 'react'

const CONFIG = {
  dotSpacing: 4,
  dotRadius: 1.8,
  mouseRadius: 80,
  returnSpeed: 0.05,
  pushStrength: 70,
  baseColor: { r: 200, g: 200, b: 210 },
  activeColor: { r: 120, g: 160, b: 255 },
  bgColor: '#06060a',
  text: 'Shion',
  fontSize: 180,
}

function App() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const dotsRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const frameCountRef = useRef(0)

  const initTextDots = useCallback((width, height) => {
    const dots = []
    
    const offscreen = document.createElement('canvas')
    const offCtx = offscreen.getContext('2d')
    offscreen.width = width
    offscreen.height = height
    
    // Responsive font size
    const fontSize = Math.min(CONFIG.fontSize, width * 0.25)
    
    offCtx.fillStyle = '#ffffff'
    offCtx.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`
    offCtx.textAlign = 'center'
    offCtx.textBaseline = 'middle'
    offCtx.fillText(CONFIG.text, width / 2, height / 2)
    
    const imageData = offCtx.getImageData(0, 0, width, height)
    const pixels = imageData.data
    
    for (let y = 0; y < height; y += CONFIG.dotSpacing) {
      for (let x = 0; x < width; x += CONFIG.dotSpacing) {
        const i = (y * width + x) * 4
        const alpha = pixels[i + 3]
        
        if (alpha > 128) {
          dots.push({
            originX: x,
            originY: y,
            x: x + (Math.random() - 0.5) * 400,
            y: y + (Math.random() - 0.5) * 400,
            vx: 0,
            vy: 0,
            delay: Math.random() * 60,
            arrived: false,
          })
        }
      }
    }
    
    return dots
  }, [])

  const lerp = (start, end, factor) => start + (end - start) * factor
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      dotsRef.current = initTextDots(width, height)
      frameCountRef.current = 0
    }

    const animate = () => {
      ctx.fillStyle = CONFIG.bgColor
      ctx.fillRect(0, 0, width, height)

      const mouse = mouseRef.current
      frameCountRef.current++
      const frameCount = frameCountRef.current

      dotsRef.current.forEach((dot) => {
        if (frameCount < dot.delay) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, CONFIG.dotRadius * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${CONFIG.baseColor.r}, ${CONFIG.baseColor.g}, ${CONFIG.baseColor.b}, 0.2)`
          ctx.fill()
          return
        }
        
        if (!dot.arrived && frameCount < dot.delay + 60) {
          const progress = (frameCount - dot.delay) / 60
          const eased = easeOutQuart(progress)
          dot.x = lerp(dot.x, dot.originX, eased * 0.15)
          dot.y = lerp(dot.y, dot.originY, eased * 0.15)
        } else {
          dot.arrived = true
        }

        const dx = mouse.x - dot.originX
        const dy = mouse.y - dot.originY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < CONFIG.mouseRadius) {
          const force = easeOutQuart(1 - distance / CONFIG.mouseRadius)
          const angle = Math.atan2(dy, dx)
          const pushX = -Math.cos(angle) * force * CONFIG.pushStrength
          const pushY = -Math.sin(angle) * force * CONFIG.pushStrength
          
          dot.vx += (pushX - dot.vx) * 0.2
          dot.vy += (pushY - dot.vy) * 0.2
        }

        dot.x = lerp(dot.x, dot.originX + dot.vx, CONFIG.returnSpeed)
        dot.y = lerp(dot.y, dot.originY + dot.vy, CONFIG.returnSpeed)
        
        dot.vx *= 0.92
        dot.vy *= 0.92

        const offsetDistance = Math.sqrt(
          Math.pow(dot.x - dot.originX, 2) + 
          Math.pow(dot.y - dot.originY, 2)
        )
        const colorIntensity = Math.min(offsetDistance / 30, 1)
        
        const r = Math.round(lerp(CONFIG.baseColor.r, CONFIG.activeColor.r, colorIntensity))
        const g = Math.round(lerp(CONFIG.baseColor.g, CONFIG.activeColor.g, colorIntensity))
        const b = Math.round(lerp(CONFIG.baseColor.b, CONFIG.activeColor.b, colorIntensity))
        
        const alpha = 0.6 + colorIntensity * 0.4
        const radius = CONFIG.dotRadius + colorIntensity * 1

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()

        if (colorIntensity > 0.3) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, radius + 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${CONFIG.activeColor.r}, ${CONFIG.activeColor.g}, ${CONFIG.activeColor.b}, ${colorIntensity * 0.15})`
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      const cursor = document.getElementById('cursor-ring')
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initTextDots])

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: CONFIG.bgColor,
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'none',
        }}
      />
      
      <div
        id="cursor-ring"
        style={{
          position: 'fixed',
          width: '24px',
          height: '24px',
          border: '1px solid rgba(120, 160, 255, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s',
          zIndex: 1000,
        }}
      />

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(200, 200, 210, 0.4)',
          letterSpacing: '0.4em',
          fontFamily: "'Helvetica Neue', sans-serif",
          fontWeight: 300,
          textTransform: 'uppercase',
        }}>
          Interactive Typography
        </p>
      </div>
    </div>
  )
}

export default App
