import React from "react";
import { Phone, MapPin, ExternalLink, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inquiryFormSchema } from "../../../components/forms/validationSchemas";
import { inquiryService } from "../../../services/inquiryService";
import { showSuccess, showError } from "../../../components/common/Toast";

export default function ContactSection({ venue, slots }) {
  const mapsLink = venue.google_maps_link;
  const isEmbeddable = mapsLink && mapsLink.includes("/maps/embed");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(inquiryFormSchema)
  });

  const onSubmit = async (values) => {
    try {
      await inquiryService.submitPublic(venue.id, values);
      showSuccess("Thank you! We'll get back to you shortly.");
      reset();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to submit inquiry");
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`;

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: venue.theme_color || "#7c3aed" }}>
            Reach Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
            Fill in your details and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* LEFT — Contact details + map */}
          <div className="space-y-6">
            {venue.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: venue.theme_color || "#7c3aed" }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                  <a href={`tel:${venue.phone}`}
                    className="font-semibold text-gray-900 dark:text-white hover:underline">
                    {venue.phone}
                  </a>
                </div>
              </div>
            )}

            {venue.address && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: venue.theme_color || "#7c3aed" }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{venue.address}</p>
                  {venue.city && <p className="text-sm text-gray-500">{venue.city}</p>}
                </div>
              </div>
            )}

            {mapsLink && (
              <div className="rounded-2xl overflow-hidden shadow-lg h-64 border dark:border-gray-800">
                {isEmbeddable ? (
                  <iframe
                    src={mapsLink}
                    title="Venue location"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  
                  <a  href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center px-6"
                  >
                    <MapPin size={32} style={{ color: venue.theme_color || "#7c3aed" }} />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      View {venue.hall_name || "Location"} on Google Maps
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      Open map <ExternalLink size={14} />
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Enquiry form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input className={inputClass} placeholder="Your Name *" {...register("customer_name")} />
                  {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
                </div>
                <div>
                  <input className={inputClass} placeholder="Phone Number *" {...register("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <input className={inputClass} placeholder="Email (optional)" {...register("email")} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input type="date" className={inputClass} {...register("event_date")}
                    min={new Date().toISOString().split("T")[0]} />
                  {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date.message}</p>}
                </div>
                <select className={inputClass} {...register("slot_id")}>
                  <option value="">Select Slot (optional)</option>
                  {(slots || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input className={inputClass} placeholder="Event Type (e.g. Wedding) *" {...register("event_type")} />
                  {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type.message}</p>}
                </div>
                <div>
                  <input type="number" className={inputClass} placeholder="Guest Count *" {...register("guest_count")} />
                  {errors.guest_count && <p className="text-red-500 text-xs mt-1">{errors.guest_count.message}</p>}
                </div>
              </div>

              <textarea className={inputClass} rows={3} placeholder="Message (optional)" {...register("message")} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-60"
                style={{ backgroundColor: venue?.theme_color || "#7c3aed" }}
              >
                <Send size={18} />
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}