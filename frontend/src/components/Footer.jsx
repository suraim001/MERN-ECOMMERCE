import React from 'react';
import {Phone, Mail, GitHub, LinkedIn, Facebook} from "@mui/icons-material";
import "../componentStyles/Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer-container">
            {/* Section1 */}
            <div className="footer-section contact">
                <h3>Contact Us</h3>
                <p><Phone fontSize='small'/>Phone: +8801866911114</p>
                <p><Mail fontSize='small'/>Email: fawajsuriam@gmail.com</p>
            </div>

            {/* Section2 */}
            <div className="footer-section social">
                <h3>Follow me</h3>
                <div className="social-links">
                    <a href="" target='_blank'>
                        <GitHub className='social-icon'/>
                    </a>
                    <a href="" target='_blank'>
                        <LinkedIn className='social-icon'/>
                    </a>
                    <a href="" target='_blank'>
                        <Facebook className='social-icon'/>
                    </a>
                </div>

            </div>

            {/* Section3 */}
            <div className="footer-section about">
                <h3>About</h3>
                <p>This is a Mern Stack Ecommerce Website</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2026 Fawaj Suraim . All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer
