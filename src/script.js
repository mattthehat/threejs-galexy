import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 400})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 *  Galexy
 */

const params = {
    count: 187200,
    size: 0.01, 
    radius: 12.34,
    branches: 5,
    spin: -2.15,
    randomness: 1.48,
    randomPower: 7.1,
    insideColour: '#ff6030',
    outsideColour: '#1b3984'

} 

let geometry = null;
let material = null;
let points = null;

const generateGalexy = () => {

    if(points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     *  Geomtery
     */
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(params.count * 3)
    const colours = new Float32Array(params.count * 3)

    const colourInside = new THREE.Color(params.insideColour)
    const colourOutside = new THREE.Color(params.outsideColour)



    for(let i = 0; i < params.count * 3; i++) {
        const i3 = i * 3
        const radius = Math.random()  * params.radius
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2
        const spinAngle = radius * params.spin

        const randomX = Math.pow(Math.random(), params.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * params.randomness * radius
        const randomY = Math.pow(Math.random(), params.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * params.randomness * radius
        const randomZ = Math.pow(Math.random(), params.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * params.randomness * radius

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Colour

        const mixedColour = colourInside.clone()
        mixedColour.lerp(colourOutside, radius / params.radius)

        colours[i3 + 0] = mixedColour.r
        colours[i3 + 1] = mixedColour.g
        colours[i3 + 2] = mixedColour.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3))

    /**
     *  Material
     */

    material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    }) 

    /**
     * Points
     */

    points = new THREE.Points(geometry, material)

    scene.add(points)
} 

generateGalexy()



gui.add(params, 'count')
    .min(10)
    .max(200000)
    .step(1)
    .name('Number of stars')
    .onFinishChange(generateGalexy)

gui.add(params, 'size')
    .min(0.01)
    .max(0.1)
    .step(0.01)
    .name('Star size')
    .onFinishChange(generateGalexy)

gui.add(params, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .name('Galexy Radius')
    .onFinishChange(generateGalexy)


gui.add(params, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .name('Galexy Branches')
    .onFinishChange(generateGalexy)

gui.add(params, 'spin')
    .min(0-5)
    .max(5)
    .step(0.01)
    .name('Galexy Spin')
    .onFinishChange(generateGalexy)

gui.add(params, 'randomness')
    .min(0)
    .max(2)
    .step(0.01)
    .name('Galexy Randomness')
    .onFinishChange(generateGalexy)

gui.add(params, 'randomPower')
    .min(1)
    .max(10)
    .step(0.1)
    .name('Star Spread')
    .onFinishChange(generateGalexy)

gui.addColor(params, 'insideColour')
    .name('Inside Colour')
    .onFinishChange(generateGalexy)

gui.addColor(params, 'outsideColour')
    .name('Outside Colour')
    .onFinishChange(generateGalexy)


console.log(points)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 6
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    points.rotation.y += 0.0005

    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()