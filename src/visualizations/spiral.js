import { scaleSequential, selectAll, select, scaleLinear } from 'd3'
import { returnAnimationStatus } from '../utitlities'

// Spiral / Lissajous frequency visualizer
// Draws frequency bins as points on a polar spiral, pulsing outward with amplitude
export const spiralGraph = function (analyser, colors) {
  analyser.fftSize = 512

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const h = window.innerHeight
  const w = window.innerWidth
  const cx = w / 2
  const cy = h / 2

  selectAll('svg').remove()
  const svg = select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('id', 'visualizer-svg')

  const colorScale = scaleSequential(colors).domain([0, bufferLength - 1])

  let colorOffset = 0
  let currentCount = returnAnimationStatus()

  function renderFrame () {
    if (currentCount !== returnAnimationStatus()) return
    requestAnimationFrame(renderFrame)

    analyser.getByteFrequencyData(dataArray)
    colorOffset = (colorOffset + 1) % 600

    selectAll('#visualizer-svg circle').remove()

    const maxRadius = Math.min(w, h) * 0.42
    const turns = 3.5

    dataArray.forEach((value, i) => {
      const t = i / (bufferLength - 1)
      const angle = t * turns * 2 * Math.PI
      const baseR = maxRadius * t
      const amp = (value / 255) * maxRadius * 0.22
      const r = baseR + amp

      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)

      const size = 1.5 + (value / 255) * 4

      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size)
        .attr('fill', colorScale((i + colorOffset) % bufferLength))
        .attr('opacity', 0.55 + (value / 255) * 0.45)
    })
  }

  renderFrame()
}
