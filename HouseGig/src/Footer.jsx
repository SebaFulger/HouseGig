import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div>
        © {currentYear} HouseGig. All rights reserved.
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        © {currentYear} HackPack
      </div>
    </footer>
  );
}

export default Footer;
