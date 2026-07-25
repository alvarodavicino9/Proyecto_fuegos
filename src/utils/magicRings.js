import * as THREE from 'three'

// Shader de "anillos de fuego" concéntricos para el fondo del Hero.
// Portado desde el prototipo de Claude Design (magic-rings.js) tal cual,
// solo se ajustó el import de three.js para usar el paquete de npm en vez
// del CDN. Se monta/desmonta vía mountMagicRings() dentro de un componente
// React con useEffect (ver components/hero/RingsBackground.tsx).

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform vec2 uResolution;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(p, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}
`

export function mountMagicRings(container, opts = {}) {
  if (!container) return () => {}
  const o = {
    color: '#ff7a29', colorTwo: '#e8402c', speed: 0.6, ringCount: 6, attenuation: 9,
    lineThickness: 1.6, baseRadius: 0.28, radiusStep: 0.11, scaleRate: 0.12,
    opacity: 0.55, noiseAmount: 0.05, rotation: 0, ringGap: 1.5, fadeIn: 0.7, fadeOut: 0.5,
    ...opts,
  }

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
  } catch {
    return () => {}
  }
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10)
  camera.position.z = 1

  const uniforms = {
    uTime: { value: 0 },
    uAttenuation: { value: o.attenuation },
    uResolution: { value: new THREE.Vector2() },
    uColor: { value: new THREE.Color(o.color) },
    uColorTwo: { value: new THREE.Color(o.colorTwo) },
    uLineThickness: { value: o.lineThickness },
    uBaseRadius: { value: o.baseRadius },
    uRadiusStep: { value: o.radiusStep },
    uScaleRate: { value: o.scaleRate },
    uRingCount: { value: o.ringCount },
    uOpacity: { value: o.opacity },
    uNoiseAmount: { value: o.noiseAmount },
    uRotation: { value: (o.rotation * Math.PI) / 180 },
    uRingGap: { value: o.ringGap },
    uFadeIn: { value: o.fadeIn },
    uFadeOut: { value: o.fadeOut },
  }

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  scene.add(quad)

  const resize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setSize(w, h)
    renderer.setPixelRatio(dpr)
    uniforms.uResolution.value.set(w * dpr, h * dpr)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  let frameId
  const animate = (t) => {
    frameId = requestAnimationFrame(animate)
    uniforms.uTime.value = (t * 0.001) * o.speed
    renderer.render(scene, camera)
  }
  frameId = requestAnimationFrame(animate)

  return () => {
    cancelAnimationFrame(frameId)
    ro.disconnect()
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    renderer.dispose()
    material.dispose()
    quad.geometry.dispose()
  }
}
