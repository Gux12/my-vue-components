import Vue from 'vue'
import MathFormulasLabel from '@/components/math/MathFormulasLabel'

describe('MathFormulasLabel', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(MathFormulasLabel)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
