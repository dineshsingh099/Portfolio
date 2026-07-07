import { useState } from "react";
import api from "../api";

export default function Contact({ contact }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/api/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="contact section-editable" id="contact">
      <div className="eyebrow-center">
        <div className="eyebrow">CONTACT</div>
      </div>
      <h2 className="section-title centered">{contact.heading}</h2>

      <div className="contact-grid">
        <div className="contact-details">
          <h3>Get In Touch</h3>
          <p>{contact.intro}</p>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="contact-label">
              <span>EMAIL</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="contact-label">
              <span>PHONE</span>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="contact-label">
              <span>LOCATION</span>
              <p>{contact.location}</p>
            </div>
          </div>
          <div className="contact-socials">
            <a href={contact.socialLinks.github} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={contact.socialLinks.linkedin} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href={contact.socialLinks.instagram} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Your Name</label>
              <input type="text" required value={form.name} placeholder="e.g. Rahul Sharma" onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Your Email</label>
              <input type="email" required value={form.email} placeholder="email@example.com" onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label>Subject</label>
            <input type="text" value={form.subject} placeholder="Job Opportunity / Project Inquiry" onChange={(e) => set("subject", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Message</label>
            <textarea rows={5} required value={form.message} placeholder="Tell me about the opportunity or project..." onChange={(e) => set("message", e.target.value)}></textarea>
          </div>
          <button type="submit" className="btn-primary" disabled={status === "sending"}>
            <i className="fa-solid fa-paper-plane"></i> {status === "sending" ? "Sending..." : "Send Message"}
          </button>
          {status === "sent" && (
            <div className="form-success show">
              <i className="fa-solid fa-circle-check"></i> Message sent! I'll respond soon.
            </div>
          )}
          {status === "error" && (
            <div className="form-success show" style={{ color: "#ff8080" }}>
              <i className="fa-solid fa-circle-exclamation"></i> Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
