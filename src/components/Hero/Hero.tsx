import React from 'react'
import './Hero.css'
import { me } from './me'

const Hero = () => {
  return (
      <section className='hero' >     
        <h1> { me.name } </h1>
        <h3 className='job' > { me.job } </h3>
        <h4 className='message' > { me.message } </h4>
      </section>
  )
}

export default Hero
