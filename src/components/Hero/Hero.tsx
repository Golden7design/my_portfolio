import React from 'react'
import './Hero.css'
import { me } from './me'
import ParticlesCanvas from './ParticlesCanvas'
import { TechLogos } from '../techlogo/TechLogos'

const Hero = () => {
  return (
      <section className='hero'>
        <ParticlesCanvas/>
        
        <div className='hero-content'>
          <div className="textes">
          <h1><span>Hey, I'm </span> {me.name}</h1> 
          <h3 className='job'>{me.job}</h3>
          <h4 className='message'>{me.message}</h4>
          </div>

          <div className="links-content">
            <div className="bar-content">
              <div className="dot"></div>
              <div className="bar"></div>
              <div className="dot"></div>
            </div>
            <div className="links">
              <TechLogos.GitHub/>
              <TechLogos.LinkedIn/>
              <TechLogos.Whatsapp/>
            </div>

          </div>

        </div>
        
        <div className='hero-spacer'></div>

        <div className="scroll">
          <h4>Scroll down</h4>
        </div>

    
      </section>
  )
}

export default Hero