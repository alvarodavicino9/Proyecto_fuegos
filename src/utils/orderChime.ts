// Chime de "pedido nuevo" generado con Web Audio API (dos tonos tipo
// "ding-dong"), sin depender de ningún archivo de audio externo. Si el
// navegador no soporta Web Audio (muy poco común hoy), falla en silencio.

export function playOrderChime(): void {
  try {
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }
    const AudioCtx = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const now = ctx.currentTime

    function playTone(freq: number, start: number, duration: number) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + start)
      gain.gain.linearRampToValueAtTime(0.28, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + duration + 0.05)
    }

    playTone(880, 0, 0.18) // "ding"
    playTone(1108.73, 0.16, 0.24) // "dong" (más agudo)

    // Cierra el contexto un rato después para no dejar audio contexts
    // colgados si suenan muchas notificaciones seguidas.
    window.setTimeout(() => ctx.close().catch(() => {}), 1200)
  } catch {
    // Sin soporte de Web Audio — no rompemos nada, simplemente no suena.
  }
}
