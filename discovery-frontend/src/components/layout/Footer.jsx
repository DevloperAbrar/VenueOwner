import React from "react";
import { Link } from "react-router-dom";
import { BRAND_NAME, CATEGORIES } from "../../lib/constants";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

export default function Footer() {
  const topCategories = CATEGORIES.slice(0, 10);

  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div>
          <Link to="/" className="text-lg font-display font-bold text-navy-900">
            In<span className="text-primary-600">2</span>Fest
          </Link>
          <p className="text-gray-500 mt-2 text-xs leading-relaxed">
            Search, compare and contact verified wedding and event vendors near you.
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-3">Popular Categories</p>
          <ul className="space-y-2">
            {topCategories.map((cat) => (
              <li key={cat.slug}>
                <Link to={`/search?category=${cat.slug}`} className="text-gray-500 hover:text-primary-600 text-xs">
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/categories" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                View all categories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-3">Company</p>
          <ul className="space-y-2">
            <li><Link to="/search" className="text-gray-500 hover:text-primary-600 text-xs">Browse Vendors</Link></li>
            <li><Link to="/cities" className="text-gray-500 hover:text-primary-600 text-xs">All Cities</Link></li>
            <li><Link to="/for-vendors" className="text-gray-500 hover:text-primary-600 text-xs">For Vendors</Link></li>
            <li><a href={`${APP_URL}/login`} className="text-gray-500 hover:text-primary-600 text-xs">List Your Business</a></li>
            <li><Link to="/about" className="text-gray-500 hover:text-primary-600 text-xs">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-500 hover:text-primary-600 text-xs">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-3">Legal</p>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-gray-500 hover:text-primary-600 text-xs">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-gray-500 hover:text-primary-600 text-xs">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-3">Also searched as</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            I2F, IntoFest, In to Fest, In Two Fest, In 2 Fest
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs text-gray-400 flex flex-col gap-1">
          <p>
            © {new Date().getFullYear()}{" "}
            
             <a href="https://campussafar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 transition-colors"
            >
              Campussafar Technologies Private Limited®
            </a>
            . All rights reserved.
          </p>
          <p className="text-gray-400">
            {BRAND_NAME}™ is a trademark of Campussafar Technologies Private Limited®.
          </p>
        </div>
      </div>
    </footer>
  );
}