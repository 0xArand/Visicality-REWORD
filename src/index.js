import { barGraph } from './visualizations/bar_graph'
import { horizontalBar } from './visualizations/horizontal_graph'
import { circleGraph } from './visualizations/circle_graph'
import { circleLinear } from './visualizations/circle_linear'
import { symetricalLine } from './visualizations/symetrical_line'
import { symetricalCircle } from './visualizations/symetrical_circle'
import { waveformLinear } from './visualizations/waveform_line'
import { waveformCircle } from './visualizations/waveform_circle'
import { fullScreen } from './visualizations/full_screen'
import { spiralGraph } from './visualizations/spiral'
import { formatTime, getRandomColor, removeVisualizer, changeAnimationStatus } from './utitlities'
import { YouTubePlayer } from './youtube'

import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/brands.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'

import './styles/app.scss'
import fscreen from 'fscreen'
import { interpolateRainbow, interpolatePlasma, interpolateViridis, interpolateSinebow, interpolateSpectral, interpolateCubehelixDefault, interpolateYlOrRd, interpolateYlGnBu, interpolateGreys } from 'd3'

window.onload = () => {
  const audio = document.getElementById('audio')
  const playPause = document.getElementById('play-pause')
  const progressBar = document.getElementById('playbar-progress')
  const timeProgress = document.getElementById('time-progress')
  const timeLeft = document.getElementById('time-left')
  const largePlayIcon = document.getElementById('large-play-icon')
  const gainBarValue = document.getElementById('gain-bar-value')
  const colorPicker1 = document.getElementById('color-picker-1')
  const colorPicker2 = document.getElementById('color-picker-2')
  const colorPicker3 = document.getElementById('color-picker-3')
  const enterExitFullScreen = document.getElementById('full-screen-container')
  const demoContainer = document.getElementById('demo-button-container')

  const colorPickerLabel1 = document.getElementById('color-picker-label-1')
  const colorPickerLabel2 = document.getElementById('color-picker-label-2')
  const colorPickerLabel3 = document.getElementById('color-picker-label-3')

  const app = document.getElementById('app')
  const backgroundColorHeader = document.getElementById('background-color-header')
  const leftSidebar = document.getElementById('left-sidebar')
  const rightSidebar = document.getElementById('right-sidebar')
  const footerAudioPlayer = document.getElementById('footer-audio-player')
  const rightGainBar = document.getElementById('right-gain-bar')
  const topBar = document.getElementById('top-bar')
  const projectName = topBar  // alias — top-bar replaces project-name
  const favicon = document.getElementById('favicon')

  const informationModal = document.getElementById('information-modal')
  const keyboardModal = document.getElementById('keyboard-modal')

  const barGraphButton = document.getElementById('bar-graph-button')
  const horizontalBarButton = document.getElementById('horizontal-bar-button')
  const circleGraphButton = document.getElementById('circle-graph-button')
  const circleLinearButton = document.getElementById('circle-linear-button')
  const symetricalLineButton = document.getElementById('symetrical-line-button')
  const symetricalCircleButton = document.getElementById('symetrical-circle-button')
  const waveformLinearButton = document.getElementById('waveform-linear-button')
  const waveformCircleButton = document.getElementById('waveform-circle-button')
  const fullScreenButton = document.getElementById('full-screen-button')
  const spiralButton = document.getElementById('spiral-button')

  const viridisButton = document.getElementById('viridis-button')
  const plasmaButton = document.getElementById('plasma-button')
  const spectralButton = document.getElementById('spectral-button')
  const cubehelixButton = document.getElementById('cubehelix-button')
  const rainbowButton = document.getElementById('rainbow-button')
  const sinebowButton = document.getElementById('sinebow-button')
  const ylOrRdDButton = document.getElementById('ylorrd-button')
  const ylGnBuButton = document.getElementById('ylgnbu-button')
  const greysButton = document.getElementById('greys-button')

  // YouTube panel elements
  const youtubePanel = document.getElementById('youtube-panel')
  const ytToggleBtn = document.getElementById('yt-toggle-btn')
  const youtubePanelClose = document.getElementById('youtube-panel-close')
  const youtubeUrlInput = document.getElementById('youtube-url-input')
  const youtubePlayBtn = document.getElementById('youtube-play-btn')
  const youtubeIframe = document.getElementById('youtube-iframe')
  const youtubeEmbedPlaceholder = document.getElementById('youtube-embed-placeholder')

  let selectedVisualizer = 'barGraph'
  let selectedColor = 'rainbowD3'
  let selectedBackgroundDirection = '45deg'
  let youtubePanelOpen = false

  const visualizerObj = {
    barGraph: { button: barGraphButton, visualizer: barGraph, prev: 'spiralGraph', next: 'horizontalBar' },
    horizontalBar: { button: horizontalBarButton, visualizer: horizontalBar, prev: 'barGraph', next: 'circleGraph' },
    circleGraph: { button: circleGraphButton, visualizer: circleGraph, prev: 'horizontalBar', next: 'circleLinear' },
    circleLinear: { button: circleLinearButton, visualizer: circleLinear, prev: 'circleGraph', next: 'symetricalLine' },
    symetricalLine: { button: symetricalLineButton, visualizer: symetricalLine, prev: 'circleLinear', next: 'symetricalCircle' },
    symetricalCircle: { button: symetricalCircleButton, visualizer: symetricalCircle, prev: 'symetricalLine', next: 'fullScreen' },
    fullScreen: { button: fullScreenButton, visualizer: fullScreen, prev: 'symetricalCircle', next: 'waveformLinear' },
    waveformLinear: { button: waveformLinearButton, visualizer: waveformLinear, prev: 'fullScreen', next: 'waveformCircle' },
    waveformCircle: { button: waveformCircleButton, visualizer: waveformCircle, prev: 'waveformLinear', next: 'spiralGraph' },
    spiralGraph: { button: spiralButton, visualizer: spiralGraph, prev: 'waveformCircle', next: 'barGraph' }
  }

  const colorObj = {
    rainbowD3: { button: rainbowButton, color: interpolateRainbow, prev: 'greysD3', next: 'plasmaD3' },
    plasmaD3: { button: plasmaButton, color: interpolatePlasma, prev: 'rainbowD3', next: 'viridisD3' },
    viridisD3: { button: viridisButton, color: interpolateViridis, prev: 'plasmaD3', next: 'sinebowD3' },
    sinebowD3: { button: sinebowButton, color: interpolateSinebow, prev: 'viridisD3', next: 'spectralD3' },
    spectralD3: { button: spectralButton, color: interpolateSpectral, prev: 'sinebowD3', next: 'cubehelixD3' },
    cubehelixD3: { button: cubehelixButton, color: interpolateCubehelixDefault, prev: 'spectralD3', next: 'ylOrRdD3' },
    ylOrRdD3: { button: ylOrRdDButton, color: interpolateYlOrRd, prev: 'cubehelixD3', next: 'ylGnBuD3' },
    ylGnBuD3: { button: ylGnBuButton, color: interpolateYlGnBu, prev: 'ylOrRdD3', next: 'greysD3' },
    greysD3: { button: greysButton, color: interpolateGreys, prev: 'ylGnBuD3', next: 'rainbowD3' }
  }

  const directionArr = ['0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg']

  const AudioContext = window.AudioContext || window.webkitAudioContext
  let contextCreated = false
  let context
  let analyser
  let gain

  const createContext = () => {
    contextCreated = true
    context = new AudioContext()
    analyser = context.createAnalyser()
    analyser.minDecibels = -105
    analyser.maxDecibels = -25
    analyser.smoothingTimeConstant = 0.8
    gain = context.createGain()
    const src = context.createMediaElementSource(audio)
    src.connect(gain)
    gain.connect(analyser)
    analyser.connect(context.destination)
    createVisualizer()
  }

  // ─── Hide / Show UI elements ───────────────────────────────────────────────
  const hideElements = () => {
    if (!audio.paused) {
      backgroundColorHeader.style.opacity = 0
      leftSidebar.style.opacity = 0
      rightSidebar.style.opacity = 0
      footerAudioPlayer.style.opacity = 0
      rightGainBar.style.opacity = 0
      topBar.style.opacity = 0
      demoContainer.style.opacity = 0
    }
  }

  const showElements = () => {
    backgroundColorHeader.style.opacity = ''
    leftSidebar.style.opacity = ''
    rightSidebar.style.opacity = ''
    footerAudioPlayer.style.opacity = ''
    rightGainBar.style.opacity = ''
    topBar.style.opacity = ''
    demoContainer.style.opacity = ''
  }

  // ─── Modals ────────────────────────────────────────────────────────────────
  const openModal = (modal) => {
    modal.classList.add('modal-open')
  }
  const closeModal = (modal) => {
    modal.classList.remove('modal-open')
  }

  document.getElementById('info-link').onclick = () => openModal(informationModal)

  document.getElementById('close-modal').onclick = () => closeModal(informationModal)

  informationModal.onclick = e => {
    if (e.target === informationModal) closeModal(informationModal)
  }

  document.getElementById('keyboard-controls').onclick = () => openModal(keyboardModal)

  document.getElementById('keyboard-close-modal').onclick = () => closeModal(keyboardModal)

  keyboardModal.onclick = e => {
    if (e.target === keyboardModal) closeModal(keyboardModal)
  }

  // ─── YouTube Panel ─────────────────────────────────────────────────────────
  const toggleYouTubePanel = () => {
    youtubePanelOpen = !youtubePanelOpen
    if (youtubePanelOpen) {
      youtubePanel.classList.remove('youtube-panel-closed')
      youtubePanel.classList.add('youtube-panel-open')
      ytToggleBtn.classList.add('active')
    } else {
      youtubePanel.classList.remove('youtube-panel-open')
      youtubePanel.classList.add('youtube-panel-closed')
      ytToggleBtn.classList.remove('active')
    }
  }

  ytToggleBtn.onclick = () => toggleYouTubePanel()
  youtubePanelClose.onclick = () => {
    if (youtubePanelOpen) toggleYouTubePanel()
  }

  // Load YouTube video into iframe
  const loadYouTubeIframe = (urlOrId) => {
    const youtubePlayerInst = new YouTubePlayer(audio)
    const videoId = youtubePlayerInst.extractVideoId(urlOrId)
    if (!videoId) return false

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
    youtubeIframe.src = embedUrl
    youtubeEmbedPlaceholder.style.display = 'none'
    document.getElementById('track-name').textContent = `YT: ${videoId}`
    return true
  }

  youtubePlayBtn.onclick = () => {
    const urlOrId = youtubeUrlInput.value.trim()
    if (!urlOrId) return
    loadYouTubeIframe(urlOrId)
  }

  youtubeUrlInput.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent?.isComposing) {
      youtubePlayBtn.click()
    }
  }

  // ─── Auto-hide timer ───────────────────────────────────────────────────────
  let timeOut

  document.onmousemove = () => {
    showElements()
    clearTimeout(timeOut)
    timeOut = setTimeout(() => hideElements(), 3000)
  }

  document.onclick = () => {
    showElements()
    clearTimeout(timeOut)
    timeOut = setTimeout(() => hideElements(), 3000)
  }

  // ─── Background Color ──────────────────────────────────────────────────────
  colorPicker1.onchange = () => setNewColors()
  colorPicker2.onchange = () => setNewColors()
  colorPicker3.onchange = () => setNewColors()

  const changeFaviconColor = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const faviconColor = canvas.getContext('2d')
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = favicon.href

    img.onload = () => {
      faviconColor.drawImage(img, 0, 0, 32, 32)
      faviconColor.clearRect(0, 0, 32, 32)
      faviconColor.beginPath()
      faviconColor.arc(16, 16, 16, 0, 2 * Math.PI)

      const gradientParams = {
        '0deg': [0, 32, 0, 0], '45deg': [0, 32, 32, 0], '90deg': [0, 0, 32, 0],
        '135deg': [0, 0, 32, 32], '180deg': [0, 0, 0, 32], '225deg': [32, 0, 0, 32],
        '270deg': [32, 32, 0, 32], '315deg': [32, 32, 0, 0]
      }

      const gradient = faviconColor.createLinearGradient(...gradientParams[selectedBackgroundDirection])
      gradient.addColorStop(0, colorPicker1.value)
      gradient.addColorStop(0.2, colorPicker1.value)
      gradient.addColorStop(0.4, colorPicker2.value)
      gradient.addColorStop(0.6, colorPicker2.value)
      gradient.addColorStop(0.8, colorPicker3.value)
      gradient.addColorStop(1, colorPicker3.value)

      faviconColor.fillStyle = gradient
      faviconColor.fill()
      favicon.href = canvas.toDataURL('image/png')
    }
  }

  const setRandomColors = () => {
    colorPicker1.value = getRandomColor()
    colorPicker2.value = getRandomColor()
    colorPicker3.value = getRandomColor()
    setNewColors()
  }

  const setNewColors = () => {
    colorPickerLabel1.style.backgroundColor = colorPicker1.value
    colorPickerLabel2.style.backgroundColor = colorPicker2.value
    colorPickerLabel3.style.backgroundColor = colorPicker3.value
    app.style.backgroundColor = colorPicker2.value
    app.style.backgroundImage = `linear-gradient(${selectedBackgroundDirection}, ${colorPicker1.value}, ${colorPicker2.value}, ${colorPicker3.value})`
    changeFaviconColor()
  }

  const rotateBackgroundLeft = () => {
    const currentIndex = directionArr.indexOf(selectedBackgroundDirection)
    selectedBackgroundDirection = directionArr[currentIndex === 0 ? 7 : currentIndex - 1]
    setNewColors()
  }

  const rotateBackgroundRight = () => {
    const currentIndex = directionArr.indexOf(selectedBackgroundDirection)
    selectedBackgroundDirection = directionArr[(currentIndex + 1) % 8]
    setNewColors()
  }

  document.getElementById('rotate-left').onclick = () => rotateBackgroundLeft()
  document.getElementById('rotate-right').onclick = () => rotateBackgroundRight()
  document.getElementById('background-color-title').onclick = () => setRandomColors()

  // ─── Visualizer ────────────────────────────────────────────────────────────
  const createVisualizer = () => {
    if (contextCreated) {
      changeAnimationStatus()
      removeVisualizer()
      visualizerObj[selectedVisualizer].visualizer(analyser, colorObj[selectedColor].color)
    }
  }

  const switchVisualizer = (newVisualizer) => {
    if (selectedVisualizer !== newVisualizer) {
      visualizerObj[selectedVisualizer].button.classList.remove('active-visualizer')
      selectedVisualizer = newVisualizer
      visualizerObj[selectedVisualizer].button.classList.add('active-visualizer')
      createVisualizer()
    }
  }

  const prevVisualizer = () => switchVisualizer(visualizerObj[selectedVisualizer].prev)
  const nextVisualizer = () => switchVisualizer(visualizerObj[selectedVisualizer].next)

  barGraphButton.onclick = () => switchVisualizer('barGraph')
  horizontalBarButton.onclick = () => switchVisualizer('horizontalBar')
  circleGraphButton.onclick = () => switchVisualizer('circleGraph')
  circleLinearButton.onclick = () => switchVisualizer('circleLinear')
  symetricalLineButton.onclick = () => switchVisualizer('symetricalLine')
  symetricalCircleButton.onclick = () => switchVisualizer('symetricalCircle')
  waveformLinearButton.onclick = () => switchVisualizer('waveformLinear')
  waveformCircleButton.onclick = () => switchVisualizer('waveformCircle')
  fullScreenButton.onclick = () => switchVisualizer('fullScreen')
  if (spiralButton) spiralButton.onclick = () => switchVisualizer('spiralGraph')

  document.getElementById('visualizer-title').onclick = () => nextVisualizer()

  // ─── Color ─────────────────────────────────────────────────────────────────
  const switchColor = (newColor) => {
    if (selectedColor !== newColor) {
      colorObj[selectedColor].button.classList.remove('active-color')
      selectedColor = newColor
      colorObj[selectedColor].button.classList.add('active-color')
      createVisualizer()
    }
  }

  const prevColor = () => switchColor(colorObj[selectedColor].prev)
  const nextColor = () => switchColor(colorObj[selectedColor].next)

  plasmaButton.onclick = () => switchColor('plasmaD3')
  viridisButton.onclick = () => switchColor('viridisD3')
  spectralButton.onclick = () => switchColor('spectralD3')
  cubehelixButton.onclick = () => switchColor('cubehelixD3')
  rainbowButton.onclick = () => switchColor('rainbowD3')
  sinebowButton.onclick = () => switchColor('sinebowD3')
  ylOrRdDButton.onclick = () => switchColor('ylOrRdD3')
  ylGnBuButton.onclick = () => switchColor('ylGnBuD3')
  greysButton.onclick = () => switchColor('greysD3')

  document.getElementById('colors-title').onclick = () => nextColor()

  // ─── Playback time display ─────────────────────────────────────────────────
  const updateDisplayTime = () => {
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`
    timeProgress.innerHTML = `<span>${formatTime(audio.currentTime, audio.duration)}</span>`
    timeLeft.innerHTML = `<span>${formatTime(audio.duration - audio.currentTime, audio.duration)}</span>`
  }

  // ─── Play / Pause ──────────────────────────────────────────────────────────
  const switchPlayPause = () => {
    if (context && audio.src !== '') {
      if (audio.paused) {
        audio.play()
        largePlayIcon.style.opacity = ''
        largePlayIcon.style.cursor = ''
      } else {
        audio.pause()
        largePlayIcon.style.opacity = 1
        largePlayIcon.style.cursor = 'pointer'
      }
    }
  }

  document.getElementById('play-pause-btn').onclick = () => switchPlayPause()
  document.getElementById('large-play').onclick = () => switchPlayPause()

  // ─── Fullscreen ────────────────────────────────────────────────────────────
  const switchFullScreen = () => {
    if (!fscreen.fullscreenElement) {
      fscreen.requestFullscreen(document.documentElement).catch(() => {
        // Silently ignore fullscreen permission errors in sandboxed contexts
      })
    } else {
      fscreen.exitFullscreen().catch(() => {})
    }
  }

  enterExitFullScreen.onclick = () => switchFullScreen()

  fscreen.onfullscreenchange = () => {
    if (fscreen.fullscreenElement) {
      enterExitFullScreen.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>'
    } else {
      enterExitFullScreen.innerHTML = '<i class="fas fa-arrows-alt"></i>'
    }
  }

  // ─── Keyboard shortcuts ────────────────────────────────────────────────────
  document.onkeyup = (e) => {
    e.preventDefault()
    if (audio.src !== '') {
      if (e.keyCode === 32) switchPlayPause()
      if (e.keyCode === 37) {
        audio.currentTime = Math.max(0, audio.currentTime - 5)
        updateDisplayTime()
      }
      if (e.keyCode === 39) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
        updateDisplayTime()
      }
      if (e.keyCode === 38) {
        if (gain.gain.value < 0.9) updateGain(gain.gain.value + 0.1)
        else if (gain.gain.value !== 1) updateGain(1)
      }
      if (e.keyCode === 40) {
        if (gain.gain.value > 0.1) updateGain(gain.gain.value - 0.1)
        else if (gain.gain.value !== 0) updateGain(0)
      }
    }
    if (e.keyCode === 65) prevColor()
    if (e.keyCode === 68) nextColor()
    if (e.keyCode === 82) setRandomColors()
    if (e.keyCode === 81) rotateBackgroundLeft()
    if (e.keyCode === 69) rotateBackgroundRight()
    if (e.keyCode === 87) prevVisualizer()
    if (e.keyCode === 83) nextVisualizer()
    if (e.keyCode === 70) switchFullScreen()
  }

  // ─── Gain control ──────────────────────────────────────────────────────────
  const updateGain = (value) => {
    gain.gain.value = value
    // Gain bar width is relative to the bar's actual rendered width
    const bar = document.getElementById('gain-bar')
    if (bar) gainBarValue.style.width = `${bar.offsetWidth * value}px`
  }

  document.getElementById('gain-bar').onclick = (e) => {
    if (context) {
      const bounds = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - bounds.left) / bounds.width
      updateGain(Math.max(0, Math.min(1, percent)))
    }
  }

  document.getElementById('gain-title').onclick = () => {
    if (context) {
      gain.gain.value !== 0 ? updateGain(0) : updateGain(1)
    }
  }

  // ─── Audio events ──────────────────────────────────────────────────────────
  audio.onpause = () => {
    playPause.classList.remove('fa-pause')
    playPause.classList.add('fa-play')
    largePlayIcon.style.opacity = 1
    largePlayIcon.style.cursor = 'pointer'
    showElements()
  }

  audio.onplay = () => {
    playPause.classList.remove('fa-play')
    playPause.classList.add('fa-pause')
    timeOut = setTimeout(() => hideElements(), 3000)
  }

  document.getElementById('playbar').onclick = (e) => {
    if (audio.src !== '') {
      const bounds = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - bounds.left) / bounds.width
      audio.currentTime = percent * audio.duration
      progressBar.style.width = `${percent * 100}%`
      updateDisplayTime()
    }
  }

  setInterval(() => {
    if (audio.src !== '') {
      updateDisplayTime()
    } else {
      timeProgress.innerHTML = ''
      timeLeft.innerHTML = ''
      progressBar.style.width = '0%'
    }
  }, 1000)

  // ─── File input ────────────────────────────────────────────────────────────
  document.getElementById('file-input-label').onclick = () => {
    if (!contextCreated) createContext()
  }

  document.getElementById('file-input').onchange = function () {
    const files = this.files
    if (files.length > 0) {
      audio.src = URL.createObjectURL(files[0])
      audio.load()
      playPause.classList.remove('fa-pause')
      playPause.classList.add('fa-play')
      largePlayIcon.style.opacity = 1
      largePlayIcon.style.cursor = 'pointer'
      const nameWithoutExt = files[0].name.split('.').slice(0, -1).join('.')
      document.getElementById('track-name').textContent = nameWithoutExt || files[0].name
    }
  }

  // ─── Demo button ───────────────────────────────────────────────────────────
  document.getElementById('demo-button').onclick = function () {
    if (!contextCreated) createContext()
    if (!audio.src.includes('01%20Keep%20on%20Mixing.m4a')) {
      audio.src = './01 Keep on Mixing.m4a'
      audio.load()
      playPause.classList.remove('fa-pause')
      playPause.classList.add('fa-play')
      largePlayIcon.style.opacity = 1
      largePlayIcon.style.cursor = 'pointer'
      document.getElementById('track-name').textContent = '01 Keep on Mixing'
    }
  }

  // ─── Resize handler ────────────────────────────────────────────────────────
  window.onresize = () => {
    createVisualizer()
  }
}
