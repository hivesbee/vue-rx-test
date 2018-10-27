<template>
  <div id="app">
    <div>distance: {{ distance }}</div>
    <div>drag position: {{ area }}</div>

    <div class="canvas"
      @mousedown="mouseDown($event)"
      @mousemove="mouseMove($event)"
      @mouseup="mouseUp($event)"
    >
      <div class="selection" :style="area" />
    </div>

  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import { interval } from 'rxjs'
import { startWith, scan, flatMap, map, mapTo, sample, takeUntil, throttle, repeat } from 'rxjs/operators'

export default {
  name: 'app',
  data () {
    return {
      offsetX: 0,
      offsetY: 0
    }
  },
  created () {
    this.$nextTick(() => {
      const e = document.querySelector('.canvas')

      const rect = e.getBoundingClientRect()
      this.offsetX = rect.left + window.pageXOffset
      this.offsetY = rect.top + window.pageYOffset
    })
  },
  observableMethods: {
    mouseDown: 'mouseDown$',
    mouseMove: 'mouseMove$',
    mouseUp: 'mouseUp$'
  },
  subscriptions () {
    return {
      area: this.mouseDown$.pipe(flatMap((e0) => {
        const x0 = e0.pageX - this.offsetX
        const y0 = e0.pageY - this.offsetY

        return this.mouseMove$.pipe(
          throttle(() => interval(10)),
          map((e1) => {
            e1.preventDefault()
            const x1 = e1.pageX - this.offsetX
            const y1 = e1.pageY - this.offsetY

            const dx = x1 - x0
            const dy = y1 - y0

            return {
              top: `${dy >= 0 ? y0 : y1}px`,
              left: `${dx >= 0 ? x0 : x1}px`,
              width: `${dx >= 0 ? dx : -dx}px`,
              height: `${dy >= 0 ? dy : -dy}px`
            }
          }
        ))
      }))
      .pipe(
        takeUntil(this.mouseUp$),
        repeat()
      ),
      distance: this.mouseMove$.pipe(
        startWith(0),
        scan((_, e) => ({
          a: e,
          x: e.offsetX,
          y: e.offsetY
        }))
      )
    }
  }
}
</script>

<style>
#app {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 200px;
}

.canvas {
  position: relative;
  width: 600px;
  height: 400px;
  background-color: #F9F9F9;
  border: solid 1px #AAAAAA;
}

.selection {
  position: absolute;
  display: block;


  border: dashed 1px black;
}

</style>
