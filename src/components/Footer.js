import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footerMain">
      <div className="sheShareColumn">
        <div className="title">She Share</div>
        <ul>
          <li>
            <Link className="footerLink" to="">About Us</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Careers</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Contact Us</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Follow Us</Link>
          </li>
        </ul>
      </div>
      <div className="supportColumn">
        <div className="title">Support</div>
        <ul>
          <li>
            <Link className="footerLink" to="">FAQs</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Cancellation Policy</Link>
          </li>
        </ul>
      </div>
      <div className="becomeaHostColumn">
        <div className="title">Become A Host</div>
        <ul>
          <li>
            <Link className="footerLink" to="">Hosting Resources</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Hosting Responsibilities</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Share A Room</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Pets</Link>
          </li>
        </ul>
      </div>
      <div className="termsAndPrivacyColumn">
        <div className="title">Terms & Privacy</div>
        <ul>
          <li>
            <Link className="footerLink" to="">Terms & Conditions</Link>
          </li>
          <li>
            <Link className="footerLink" to="">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
