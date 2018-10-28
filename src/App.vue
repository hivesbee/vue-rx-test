<template>
  <div id="app">
    <div>distance: {{ distance }}</div>
    <div>drag position: {{ area }}</div>
    <!--<div>obj: {{ aaa }}</div>-->
    <div>position: {{ selectionPosition }}</div>

    <div class="canvas"
      @mousedown="mouseDown($event)"
      @mousemove="mouseMove($event)"
      @mouseup="mouseUp($event)"
    >
      <div class="selection"
        :style="selectionStyle"
        @mousedown="dragStart($event)"
        @mousemove="dragMove($event)"
        @mouseup="dragEnd($event)"
      />
    </div>

  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import { interval } from 'rxjs'
import { startWith, scan, flatMap, map, takeUntil, throttle, repeat } from 'rxjs/operators'

import { mapGetters, mapActions } from 'vuex'

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
    mouseUp: 'mouseUp$',
    dragStart: 'dragStart$',
    dragMove: 'dragMove$',
    dragEnd: 'dragEnd$'
  },
  subscriptions () {
    return {
      area: this.mouseDown$.pipe(flatMap((e0) => {
        const x0 = e0.pageX - this.offsetX
        const y0 = e0.pageY - this.offsetY
        this.resetSelection()

        return this.mouseMove$.pipe(
          throttle(() => interval(10)),
          map((e1) => {
            e1.preventDefault()
            const x1 = e1.pageX - this.offsetX
            const y1 = e1.pageY - this.offsetY

            const dx = x1 - x0
            const dy = y1 - y0

            const a = {
              top: dy >= 0 ? y0 : y1,
              left: dx >= 0 ? x0 : x1,
              width: dx >= 0 ? dx : -dx,
              height: dy >= 0 ? dy : -dy
            }

            console.log(a)

            this.setSelection(a)
            return a
          }
        ))
      }))
      .pipe(
        takeUntil(this.mouseUp$),
        repeat()
      ),
      selectionPosition: this.dragStart$.pipe(flatMap((e0) => {
        const e = document.querySelector('.selection')
        e0.stopPropagation()
        e0.preventDefault()
        this.resetSelection()

        const rect = e.getBoundingClientRect()
        const oX = rect.left + window.pageXOffset
        const oY = rect.top + window.pageYOffset

        const x0 = e0.pageX - oX
        const y0 = e0.pageY - oY

        return this.dragMove$.pipe(
          throttle(() => interval(10)),
          map((e1) => {
            e1.stopPropagation()
            e1.preventDefault()
            const x1 = e1.pageX - oX
            const y1 = e1.pageY - oY

            const dx = x1 - x0
            const dy = y1 - y0

            const a = {
              dx: dx,
              dy: dy
            }

            this.moveSelection(a)

            return a
          }
        ))
      }))
      .pipe(
        takeUntil(this.dragEnd$),
        repeat()
      ),
      // aaa: this.$watchAsObservable(this.area).pipe(map((x) => x)),
      distance: this.mouseMove$.pipe(
        startWith(0),
        scan((_, e) => ({
          a: e,
          x: e.offsetX,
          y: e.offsetY
        }))
      )
    }
  },
  computed: {
    ...mapGetters(['selectionStyle'])
  },
  methods: {
    ...mapActions(['setSelection', 'moveSelection', 'resetSelection'])
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
  margin-left: 100px;
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
