// src/components/contacts/Contacts.js
import React from "react"
import "./Contacts.css"

const Contacts = () => {
  return (
    <div className="contact-section">
      <h2 className="contact-title">Contact Us</h2>
      <form>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name and Surname"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Country"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Message"
            required
          ></textarea>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="privacy-policy"
            name="privacy-policy"
            required
          />
          <label htmlFor="privacy-policy">I accept the privacy policy</label>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  )
}

export default Contacts
