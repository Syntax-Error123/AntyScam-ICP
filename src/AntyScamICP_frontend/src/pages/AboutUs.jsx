import React from "react";
import "../styles/AboutUs.css";
export default function AboutUs() {
    return (
        <div className="aboutus-container">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">Who We Are</h1>
                <p className="hero-description">
                    Empowering secure and transparent P2P transactions with decentralized escrow solutions.
                </p>
            </section>

            {/* Mission Statement */}
            <section className="mission-section">
                <h2 className="section-title">Our Mission</h2>
                <p className="section-description">
                    At Antyscam, our mission is to revolutionize digital transactions by providing a secure, transparent, 
                    and trustless environment for P2P trading. By leveraging blockchain technology, we eliminate the risks 
                    of fraud, ensuring fairness for all users.
                </p>
            </section>

            {/* Why Choose Us? */}
            <section className="why-choose-section">
                <div className="why-card">
                    <h3 className="why-title">Decentralized Security</h3>
                    <p className="why-description">Your transactions are secured through blockchain technology.</p>
                </div>
                <div className="why-card">
                    <h3 className="why-title">0% Risk Transactions</h3>
                    <p className="why-description">Funds are only released upon verification of trade completion.</p>
                </div>
                <div className="why-card">
                    <h3 className="why-title">Transparency & Trust</h3>
                    <p className="why-description">No middlemen, no hidden fees, just pure decentralized escrow.</p>
                </div>
            </section>

            {/* Our Vision */}
            <section className="vision-section">
                <h2 className="section-title">Our Vision</h2>
                <p className="section-description">
                    We aim to create a future where online transactions are completely scam-free, and users can trade with 
                    absolute confidence.
                </p>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <a href="#get-started" className="cta-button">Join the Movement</a>
            </section>
        </div>
    );
}