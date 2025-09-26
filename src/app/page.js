'use client';
import { useState, useRef, useEffect } from 'react';
import './creed-styles.css';

export default function Home() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Video control functions
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
          videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  };

  // Accordion functionality
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleVolumeChange = () => setIsMuted(video.muted);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('volumechange', handleVolumeChange);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className="top">
        <img src="/text.png" alt="The Creed text" id="text" />
        <img src="/spartan.png" alt="Spartan warrior" id="spartan" />
      </div>

      {/* Video Container */}
      <div className="video-container">
        <div className="hero-video-section">
          <video 
            ref={videoRef}
            muted 
            loop 
            playsInline 
            autoPlay 
            id="header-video"
            onClick={togglePlayPause}
          >
            <source src="/vido.mp4" type="video/mp4" />
          </video>
          <div className="video-controls">
            <div className="controls-left">
              <button 
                id="play-pause-btn" 
                className="control-btn" 
                title="Play/Pause"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <svg id="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg id="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>
            <div className="controls-right">
              <button 
                id="mute-unmute-btn" 
                className="control-btn" 
                title="Mute/Unmute"
                onClick={toggleMuteUnmute}
              >
                {isMuted ? (
                  <svg id="mute-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-volume-x">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg id="volume-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-volume-2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>
              <button 
                id="fullscreen-btn" 
                className="control-btn" 
                title="Fullscreen"
                onClick={toggleFullscreen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-maximize">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <a 
        className="join" 
        href="https://matrix.to/#/#the-creed-landing:matrix.the-creed.org" 
        style={{textDecoration: 'none'}} 
        target="_blank"
        rel="noopener noreferrer"
      >
        Join the Creed
      </a>

      {/* Main Content */}
      <div className="main-container" style={{padding: '40px 25px'}}>
        <header className="page-header">
          <h1>
            <span className="title-white">KNOW THE</span>
            <span className="title-red"> CREED...</span>
          </h1>
      </header>

        <main className="creed-cards-container">
          <div className="creed-card">
            <h2>Unity</h2>
            <img src="/unity.png" alt="Two soldiers standing together" className="card-icon" />
            <p className="quote">&ldquo;And No King stood alone&rdquo;</p>
            <img src="/wings.png" alt="Laurel wreath" className="laurel-icon" />
            <ul>
              <li>Divided we fall, united we rise.</li>
              <li>We thrive when brothers join hands</li>
              <li>Shared discipline, loyalty, and destiny.</li>
            </ul>
          </div>

          <div className="creed-card">
            <h2>Faith</h2>
            <img src="/faith.png" alt="Spartan helmet" className="card-icon" />
            <p className="quote">&ldquo;Trust god and let him guide your blade&rdquo;</p>
            <img src="/wings.png" alt="Laurel wreath" className="laurel-icon" />
            <ul>
              <li>Without Faith, We Fall</li>
              <li>Faith is the Flame that guides</li>
              <li>Faith is your spear</li>
            </ul>
        </div>

          <div className="creed-card">
            <h2>Discipline</h2>
            <img src="/discipline.png" alt="Spartan shield" className="card-icon" />
            <p className="quote">&ldquo;Persevere when others falter&rdquo;</p>
            <img src="/wings.png" alt="Laurel wreath" className="laurel-icon" />
            <ul>
              <li>Freedom is Earned Through Discipline</li>
              <li>Discipline is the Backbone</li>
              <li>Discipline Turns Men Into Legends</li>
            </ul>
        </div>
      </main>
      </div>

      {/* Footer Video */}
      <video autoPlay muted loop id="myVideo">
        <source src="/footer.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="image-overlay"></div>

      {/* Footer Content */}
      <div className="main-container-footer">
        <header className="site-header">
          <img src="/icon.png" alt="The Creed Logo" className="logo" />
          <span>The Creed</span>
        </header>

        <main>
          <section className="newsletter-signup">
            <h1>SIGN UP FOR THE CREED&apos;S</h1>
            <h2 className="subtitle"><span>Newsletter</span>...</h2>

            <form className="signup-form">
              <input type="email" placeholder="Enter your email..." />
              <button type="submit" className="btn-text">Get Notified...</button>
            </form>
          </section>

          <section className="faq-section">
            <div className="faq-header">
              <img src="/warrior-right.png" alt="Soldier silhouette" className="soldier" />
              <div className="faq-title">
                <h3>Frequently Asked</h3>
                <p><span>Questions</span>...</p>
              </div>
              <img src="/warrior-left.png" alt="Soldier silhouette" className="soldier" />
            </div>

            <div className="accordion">
              <div 
                className={`accordion-item ${activeAccordion === 0 ? 'active' : ''}`}
                onClick={() => toggleAccordion(0)}
              >
                <div className="accordion-header">
                  <span>Requirements</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    <b>God Fearing</b> - they must embrace humility and guilt where God may punish. Believing
                    in a power higher than human will change a person to be positively contributing as an
                    asset. <br />

                    <b>Extreme Sense Of Justice</b> - Justice is difficult to classify and mark. Justice
                    should come with patience and absolute confidence with critical thinking. A calm and
                    collected approach with common sense is required. <br />

                    <b>Selflessness</b> - You yourself are your own priority. Seek help or benefit people.
                    Numbers are what makes situations a game changer. By seeking help, you become very well
                    treated. By giving help, you also become very well treated. <br />

                    <b>Stoic</b> - Emotional manipulation is psychologically penetrated everywhere and it
                    destroys our sense of control. Always utilise apathy and patience. <br />

                    <b>Rational</b> - Similar to the last requirement, apathy and patience is utmost
                    required to evaluate true senses. <br />

                    <b>Faithful</b> - Stress and other emotions deeply paralyse us. It is how the whole
                    world works. Close your mouth, do what is necessary. If it doesn&apos;t work, don&apos;t worry.
                    Mistakes are inevitable. <br />

                    <b>Disciplined</b> - Similar to the last point, you need to recognise destruction
                    happens overnight but creation never happens overnight. <br />

                    <b>United</b> - Tough bonds are hard to break. You must be capable of keeping tough
                    bonds and to keep fortifying it. <br />

                    <b>No Avarice</b> - Having your own rewards is one thing. Greed is another thing. Greed
                    inhibits diversity and variety of success. Envy will quickly destroy you if you&apos;re not
                    careful. <br />

                    If you keep too much money to yourself, you will lose your business. Then your
                    character. Then your money. <br />

                    Jews/Zionists/Believers of the works of degeneracy are strictly prohibited to enter. <br />

                    All of these principles are wholly non-negotiable. Any discrepancies or disparity in
                    above principles shall be met with fury and hard punishment for a lifetime. <br />
                    We will not hesitate to implement a Dishonourble Discharge. <br />

                    We value integrity. We will not be afraid to act where truly necessary. If people had no
                    integrity Satan himself would be sitting next to God. <br />
                  </p>
                </div>
              </div>

              <div 
                className={`accordion-item ${activeAccordion === 1 ? 'active' : ''}`}
                onClick={() => toggleAccordion(1)}
              >
                <div className="accordion-header">
                  <span>Values</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    Along with unity, faith and discipline - we value a strong, and able character. A
                    character not bound by no influence, A character not afraid stand first in line for
                    duty. <br />
                    We require Brothers that bring greatness to the table. <br />

                    Idleness and imparticipation is frowned upon and will land you out of the Creed by
                    exile.
                  </p>
                </div>
              </div>

              <div 
                className={`accordion-item ${activeAccordion === 2 ? 'active' : ''}`}
                onClick={() => toggleAccordion(2)}
              >
                <div className="accordion-header">
                  <span>Why are we different</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    We arent a brotherhood limited to just &ldquo;talk&rdquo; we take actionable steps across the world
                    to make sure we become an immovable object where evil is concerned. <br />
                    We will not hesitate to lay down our lives and love for our brothers - the elites have
                    pioneered against us to be in a state of disunity and and distrustful ness - while they
                    sit united in there throne of lies. <br />
                    You must be united, you must fight or you will be forgotten. <br />

                    War with ourselves for a good cause, War against the oppressors is what we stand for. <br />

                    Its what The Creed stands for...
                  </p>
                </div>
              </div>

              <div 
                className={`accordion-item ${activeAccordion === 3 ? 'active' : ''}`}
                onClick={() => toggleAccordion(3)}
              >
                <div className="accordion-header">
                  <span>Application Process</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    Click on our self hosted Space where you can learn more about the application process: <br />
                    <a href="https://matrix.to/#/#the-creed-landing:matrix.the-creed.org">Click Here to Apply</a>
                  </p>
                </div>
              </div>

              <div 
                className={`accordion-item ${activeAccordion === 4 ? 'active' : ''}`}
                onClick={() => toggleAccordion(4)}
              >
                <div className="accordion-header">
                  <span>Age Limit And Must Have(s)</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    <b>Age Limit:</b> 18+ <br />
                    You must have a means to support yourself i.e your own business or job.
                  </p>
                </div>
              </div>

              <div 
                className={`accordion-item ${activeAccordion === 5 ? 'active' : ''}`}
                onClick={() => toggleAccordion(5)}
              >
                <div className="accordion-header">
                  <span>Pool Funds Deposit</span>
                  <span className="plus-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>
                    We have paypal. <br />
                    We have crypto <b>(RECOMMENDED)</b>. <br />
                    And for big amounts (500 plus) we have also have Western Union Cash.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="site-footer-final">
        <div className="footer-container">
          <div className="footer-logo-area">
            <img src="/icon.png" alt="The Creed Logo" className="footer-logo" />
            <span className="footer-logo-text">The Creed</span>
          </div>

          <div className="footer-center-area">
            <nav className="footer-nav">
              <ul>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">ToC</a></li>
                <li><a href="#">Our Policies</a></li>
                <li><a href="#">Our Laws</a></li>
              </ul>
            </nav>
            <p className="footer-quote">&ldquo;Better to die on your feet than to live on your knees&rdquo;</p>
          </div>

          <div className="footer-social-area">
            <a href="#" aria-label="Instagram">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d8b375" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
