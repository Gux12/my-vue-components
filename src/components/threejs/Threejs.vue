<template>
  <div v-if="!ready"
       v-loading.body="!ready"
       element-loading-text="拼命加载中"
       class="page-loading">

  </div>
  <div v-else>
  </div>
</template>
<script>
  let THREE = require('three')

  export default {
    name: '',
    data () {
      return {
        ready: false,
        canvasSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        renderer: null,
        camera: null
      }
    },
    methods: {
      handleWindowResize (event) {
        this.canvasSize.width = event.currentTarget.innerWidth
        this.canvasSize.height = event.currentTarget.innerHeight
        this.renderer.setSize(this.canvasSize.width, this.canvasSize.height)
        this.camera = new THREE.PerspectiveCamera(75, this.canvasSize.width / this.canvasSize.height, 0.1, 1000)
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleWindowResize)
    },
    created () {
      this.ready = true
    },
    mounted () {
      window.addEventListener('resize', this.handleWindowResize)
      let scene = new THREE.Scene()
      let camera = new THREE.PerspectiveCamera(75, this.canvasSize.width / this.canvasSize.height, 0.1, 1000)
      this.camera = camera

      let renderer = new THREE.WebGLRenderer()
      this.renderer = renderer
      renderer.setSize(this.canvasSize.width, this.canvasSize.height)
      this.$el.appendChild(renderer.domElement)

      let geometry = new THREE.BoxGeometry(1, 1, 1)
      let material = new THREE.MeshBasicMaterial({ color: 0x234567 })
      let cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      camera.position.z = 5

      let animate = function () {
        requestAnimationFrame(animate)

        cube.rotation.x += 0.01
        cube.rotation.y += 0.01

        renderer.render(scene, camera)
      }

      animate()
    }
  }
</script>
<style scoped lang="scss">
  canvas {
    width: 100%;
    height: 100%
  }
</style>
