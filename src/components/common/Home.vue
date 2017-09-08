<template>
  <div class="hello">
    <div class="logo">
      <svg width="200" height="200">
        <circle cx="100" cy="100" r="90"></circle>
        <polygon :points="points1" fill="#123456"></polygon>
        <polygon :points="points2" fill="#234567"></polygon>
        <polygon :points="points3" fill="#345678"></polygon>
        <polygon :points="points4" fill="#456789"></polygon>
      </svg>
      <h1>Gux的Vue.js组件库</h1>
    </div>
  </div>
</template>

<script>
  function valueToPoint (x, value, index, total) {
//    let x = 0
    let y = -value * 0.9
    let angle = Math.PI * 2 / total * index
    let cos = Math.cos(angle)
    let sin = Math.sin(angle)
    let tx = x * cos - y * sin + 100
    let ty = x * sin + y * cos + 100
    return { x: tx, y: ty }
  }

  function generatePoints (stats) {
    let total = stats.length
    return stats.map(function (stat, index) {
      let x = 0
      let point = valueToPoint(x, stat, index, total)
      return point.x + ',' + point.y
    }).join(' ')
  }

  export default {
    name: 'Hello',
    data () {
      return {
        points1: [],
        points2: [],
        points3: [],
        points4: [],
        minRadius: 50,
        interval: null,
        updateInterval: 500
      }
    },
    methods: {
      genstats (defaultSides) {
        return Array.apply(null, { length: defaultSides })
          .map(function () {
            return 100
          })
      }
    },
    created () {
      this.points1 = generatePoints(this.genstats(6))
      this.points2 = generatePoints(this.genstats(5))
      this.points3 = generatePoints(this.genstats(4))
      this.points4 = generatePoints(this.genstats(3))
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .hello {
    display: flex;
    height: 100vh;
    padding-top: 100px;
    justify-content: center;
    flex-wrap: wrap;
    .logo {
      width: 100%;
      text-align: center;
    }
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  circle {
    fill: transparent;
    stroke: #012345;
    stroke-width: 10;
  }
</style>
