import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-logo-section">
          <div className="home-logo-box">
            <span className="home-logo-letter">T</span>
          </div>
          <div className="home-logo-text">
            <div className="home-institute-name">TECSUP</div>
            <div className="home-institute-desc">
              Instituto de Educación Superior
            </div>
          </div>
        </div>

        <div className="home-quote-card">
          <p>
            "La educación es el arma más poderosa para cambiar el mundo"
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
