import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "./AuthContext";

const VenueContext = createContext(null);

export function VenueProvider({ children }) {
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVenue = useCallback(async () => {
    if (!user || user.role !== "venue_owner") {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axiosInstance.get("/venues/my");
      setVenue(data.data[0] || null);
    } catch {
      setVenue(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  return (
    <VenueContext.Provider value={{ venue, setVenue, loading, refetchVenue: fetchVenue }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error("useVenue must be used within VenueProvider");
  return ctx;
}

export { VenueContext };