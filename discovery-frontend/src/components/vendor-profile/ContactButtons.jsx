import React from "react";
import { Phone, MessageCircle, Send, Bookmark } from "lucide-react";

export default function ContactButtons({ venue, onSendInquiry }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`tel:${venue.phone}`} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
        <Phone size={15} /> Call Now
      </a>
      
       <a href={`https://wa.me/${(venue.whatsapp_number || venue.phone || "").replace(/\D/g, "")}`}
        target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg"
      >
        <MessageCircle size={15} /> WhatsApp
      </a>
      <button onClick={onSendInquiry} className="flex items-center gap-1.5 bg-primary-600 text-white text-sm px-4 py-2 rounded-lg">
        <Send size={15} /> Send Inquiry
      </button>
      <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg">
        <Bookmark size={15} /> Save
      </button>
    </div>
  );
}