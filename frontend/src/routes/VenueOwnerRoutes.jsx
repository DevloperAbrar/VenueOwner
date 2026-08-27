import React from "react";
import { Routes, Route } from "react-router-dom";
import { VenueProvider } from "../context/VenueContext.jsx";

import OwnerDashboard from "../features/venue-owner/dashboard/OwnerDashboard.jsx";
import VenueDetailsForm from "../features/venue-owner/onboarding/VenueDetailsForm.jsx";
import PlanSelection from "../features/venue-owner/onboarding/PlanSelection.jsx";

import TemplatePicker from "../features/venue-owner/website-builder/TemplatePicker.jsx";
import HeroEditor from "../features/venue-owner/website-builder/HeroEditor.jsx";
import AboutEditor from "../features/venue-owner/website-builder/AboutEditor.jsx";
import ServicesEditor from "../features/venue-owner/website-builder/ServicesEditor.jsx";
import GalleryEditor from "../features/venue-owner/website-builder/GalleryEditor.jsx";
import TestimonialsEditor from "../features/venue-owner/website-builder/TestimonialsEditor.jsx";
import ContactEditor from "../features/venue-owner/website-builder/ContactEditor.jsx";
import WebsiteBuilderHome from "../features/venue-owner/website-builder/WebsiteBuilderHome.jsx";

import SlotList from "../features/venue-owner/slots/SlotList.jsx";
import InquiryList from "../features/venue-owner/inquiries/InquiryList.jsx";
import InquiryDetail from "../features/venue-owner/inquiries/InquiryDetail.jsx";
import BookingListView from "../features/venue-owner/bookings/BookingListView.jsx";
import BookingCalendarView from "../features/venue-owner/bookings/BookingCalendarView.jsx";
import ClientList from "../features/venue-owner/clients/ClientList.jsx";
import ClientDetail from "../features/venue-owner/clients/ClientDetail.jsx";

import QuotationForm from "../features/venue-owner/billing/QuotationForm.jsx";
import InvoiceForm from "../features/venue-owner/billing/InvoiceForm.jsx";
import ServiceCatalog from "../features/venue-owner/billing/ServiceCatalog.jsx";

import OwnerAnalytics from "../features/venue-owner/analytics/OwnerAnalytics.jsx";

import SettingsIndex from "../features/venue-owner/settings/index.jsx";
import VenueProfileSettings from "../features/venue-owner/settings/VenueProfileSettings.jsx";
import PaymentSettings from "../features/venue-owner/settings/PaymentSettings.jsx";
import GstSettings from "../features/venue-owner/settings/GstSettings.jsx";
import TeamMembers from "../features/venue-owner/settings/TeamMembers.jsx";
import SubscriptionDetails from "../features/venue-owner/settings/SubscriptionDetails.jsx";

export default function VenueOwnerRoutes() {
  return (
    <VenueProvider>
      <Routes>
        <Route index element={<OwnerDashboard />} />
        <Route path="onboarding/plan" element={<PlanSelection />} />
        <Route path="onboarding/details" element={<VenueDetailsForm />} />

        <Route path="website" element={<WebsiteBuilderHome />} />
        <Route path="website/template" element={<TemplatePicker />} />
        <Route path="website/hero" element={<HeroEditor />} />
        <Route path="website/about" element={<AboutEditor />} />
        <Route path="website/services" element={<ServicesEditor />} />
        <Route path="website/gallery" element={<GalleryEditor />} />
        <Route path="website/testimonials" element={<TestimonialsEditor />} />
        <Route path="website/contact" element={<ContactEditor />} />

        <Route path="slots" element={<SlotList />} />
        <Route path="inquiries" element={<InquiryList />} />
        <Route path="inquiries/:id" element={<InquiryDetail />} />
        <Route path="bookings" element={<BookingListView />} />
        <Route path="bookings/calendar" element={<BookingCalendarView />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/:id" element={<ClientDetail />} />

        <Route path="billing/quotation" element={<QuotationForm />} />
        <Route path="billing/invoice" element={<InvoiceForm />} />
        <Route path="billing/services" element={<ServiceCatalog />} />

        <Route path="analytics" element={<OwnerAnalytics />} />

        <Route path="settings" element={<SettingsIndex />} />
        <Route path="settings/profile" element={<VenueProfileSettings />} />
        <Route path="settings/payment" element={<PaymentSettings />} />
        <Route path="settings/gst" element={<GstSettings />} />
        <Route path="settings/team" element={<TeamMembers />} />
        <Route path="settings/subscription" element={<SubscriptionDetails />} />
      </Routes>
    </VenueProvider>
  );
}