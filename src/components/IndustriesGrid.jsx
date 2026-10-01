import React, { useState } from "react";

const industriesData = [
  { name: "Retail", icon: "storefront" },
  { name: "FMCG", icon: "shopping_basket" },
  { name: "Consumer Goods", icon: "category" },
  { name: "Healthcare", icon: "local_hospital" },
  { name: "Pharmaceuticals", icon: "medication" },
  { name: "Biotechnology", icon: "biotech" },
  { name: "Medical Devices", icon: "medical_services" },
  { name: "Hospitals & Healthcare Services", icon: "local_pharmacy" },
  { name: "Banking", icon: "account_balance" },
  { name: "Financial Services", icon: "payments" },
  { name: "FinTech", icon: "credit_card" },
  { name: "Insurance", icon: "health_and_safety" },
  { name: "Investment Management", icon: "trending_up" },
  { name: "Venture Capital", icon: "monetization_on" },
  { name: "Private Equity", icon: "savings" },
  { name: "Stock Market & Trading", icon: "show_chart" },
  { name: "Technology", icon: "computer" },
  { name: "IT Services", icon: "dns" },
  { name: "Software & SaaS", icon: "cloud" },
  { name: "Artificial Intelligence", icon: "smart_toy" },
  { name: "Cloud Computing", icon: "cloud_sync" },
  { name: "Cybersecurity", icon: "security" },
  { name: "Data Analytics & BI", icon: "analytics" },
  { name: "Semiconductor", icon: "memory" },
  { name: "Electronics", icon: "devices" },
  { name: "Consumer Electronics", icon: "smartphone" },
  { name: "Telecommunications", icon: "cell_tower" },
  { name: "Media", icon: "perm_media" },
  { name: "Entertainment", icon: "movie" },
  { name: "Advertising", icon: "campaign" },
  { name: "Digital Marketing", icon: "trending_up" },
  { name: "Publishing", icon: "menu_book" },
  { name: "Gaming & eSports", icon: "sports_esports" },
  { name: "Film & Television", icon: "theaters" },
  { name: "Music Industry", icon: "music_note" },
  { name: "Manufacturing", icon: "factory" },
  { name: "Industrial Automation", icon: "precision_manufacturing" },
  { name: "Heavy Engineering", icon: "construction" },
  { name: "Aerospace", icon: "flight_takeoff" },
  { name: "Defence", icon: "shield" },
  { name: "Automotive", icon: "directions_car" },
  { name: "Electric Vehicles (EV)", icon: "electric_car" },
  { name: "Logistics", icon: "local_shipping" },
  { name: "Transportation", icon: "commute" },
  { name: "Shipping & Maritime", icon: "directions_boat" },
  { name: "Aviation", icon: "flight" },
  { name: "Railways", icon: "train" },
  { name: "Warehousing", icon: "warehouse" },
  { name: "Supply Chain", icon: "inventory" },
  { name: "Real Estate", icon: "real_estate_agent" },
  { name: "Construction", icon: "architecture" },
  { name: "Infrastructure", icon: "foundation" },
  { name: "Smart Cities", icon: "location_city" },
  { name: "Architecture & Interior Design", icon: "design_services" },
  { name: "Energy", icon: "bolt" },
  { name: "Oil & Gas", icon: "local_gas_station" },
  { name: "Renewable Energy", icon: "solar_power" },
  { name: "Utilities", icon: "water_drop" },
  { name: "Mining & Metals", icon: "hardware" },
  { name: "Chemicals", icon: "science" },
  { name: "Petrochemicals", icon: "oil_barrel" },
  { name: "Agriculture", icon: "agriculture" },
  { name: "AgriTech", icon: "eco" },
  { name: "Food Processing", icon: "restaurant" },
  { name: "Dairy", icon: "local_drink" },
  { name: "Fisheries", icon: "set_meal" },
  { name: "Forestry", icon: "forest" },
  { name: "Hospitality", icon: "hotel" },
  { name: "Travel & Tourism", icon: "travel_explore" },
  { name: "Hotels & Resorts", icon: "luggage" },
  { name: "Restaurants & Food Services", icon: "restaurant_menu" },
  { name: "Education", icon: "school" },
  { name: "EdTech", icon: "cast_for_education" },
  { name: "E-Learning", icon: "computer" },
  { name: "Government & Public Sector", icon: "account_balance" },
  { name: "Legal Services", icon: "gavel" },
  { name: "HR & Recruitment", icon: "groups" },
  { name: "Consulting", icon: "support_agent" },
  { name: "BPO / KPO", icon: "headset_mic" },
  { name: "Startups & Entrepreneurship", icon: "rocket_launch" },
  { name: "NGOs & Non-Profits", icon: "volunteer_activism" },
  { name: "Social Enterprises", icon: "handshake" },
  { name: "Sustainability & ESG", icon: "recycling" },
  { name: "Waste Management", icon: "delete" },
  { name: "Water Management", icon: "water" },
  { name: "Fashion & Apparel", icon: "checkroom" },
  { name: "Luxury Goods", icon: "diamond" },
  { name: "Sports & Fitness", icon: "fitness_center" },
  { name: "Wellness & Personal Care", icon: "spa" },
  { name: "Beauty & Cosmetics", icon: "face_retouching_natural" },
  { name: "Printing & Packaging", icon: "print" },
  { name: "Furniture & Home Decor", icon: "chair" },
  { name: "Security Services", icon: "admin_panel_settings" },
  { name: "Space Technology", icon: "satellite" },
  { name: "Robotics", icon: "precision_manufacturing" },
  { name: "IoT", icon: "router" },
  { name: "Blockchain & Web3", icon: "currency_bitcoin" },
  { name: "Cryptocurrency", icon: "paid" },
  { name: "E-Commerce", icon: "shopping_cart" },
  { name: "D2C Brands", icon: "local_mall" },
  { name: "Subscription Businesses", icon: "subscriptions" },
  { name: "Creator Economy", icon: "video_camera_front" },
  { name: "Bioinformatics", icon: "biotech" },
  { name: "Genomics", icon: "science" },
  { name: "Nanotechnology", icon: "memory" },
  { name: "Defence Technology", icon: "shield" },
  { name: "Space Exploration", icon: "rocket" },
  { name: "Urban Mobility", icon: "directions_transit" },
  { name: "ClimateTech", icon: "wb_sunny" },
  { name: "Quantum Computing", icon: "memory" },
];

const IndustriesGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  };

  const filteredIndustries = industriesData.filter((ind) =>
    ind.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section
      className="py-section-gap-lg bg-background dark:bg-dark-navy transition-colors duration-300"
      id="industries"
    >
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="font-headline-md text-headline-md mb-2 dark:text-white">
              Industries Served
            </h2>
            <p className="text-slate-muted dark:text-on-surface-variant">
              If your sector exists, we research it. From frontier tech to
              legacy markets.
            </p>
          </div>
          <div className="relative w-full md:w-80 shrink-0">
            <input
              className="w-full pl-12 pr-4 py-3 rounded-xl border-border-light dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 focus:ring-accent-blue focus:border-accent-blue transition-all bg-white shadow-sm"
              placeholder="Search your industry..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-muted dark:text-white/40">
              search
            </span>
          </div>
        </div>

        {/* Scrollable Container with Dynamic Fade */}
        <div className="relative">
          {/* Dynamic Fade Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 dark:from-dark-navy dark:via-dark-navy/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 rounded-b-xl ${isAtBottom ? "opacity-0" : "opacity-100"}`}
          ></div>

          <div
            className="h-[284px] overflow-y-auto pr-4 custom-scrollbar rounded-xl border-y border-transparent"
            onScroll={handleScroll}
          >
            <div className="grid py-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-2">
              {filteredIndustries.length > 0 ? (
                filteredIndustries.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-white/5 p-2 rounded-xl border border-pale-blue dark:border-white/10 hover:border-accent-blue dark:hover:border-accent-blue shadow-sm hover:shadow-md hover:-translate-y-1 transition-all transform-gpu will-change-transform flex flex-col items-center justify-center text-center cursor-pointer h-20"
                  >
                    <span className="material-symbols-outlined text-accent-blue mb-1 text-2xl">
                      {item.icon}
                    </span>
                    <span className="font-semibold text-on-surface dark:text-white text-xs leading-tight line-clamp-2">
                      {item.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-muted dark:text-on-surface-variant">
                  No industries found matching "{searchTerm}". We still likely
                  cover it!
                </div>
              )}
            </div>
            {filteredIndustries.length > 0 && (
              <div className="py-4 text-center text-xs text-on-surface-variant/50 dark:text-white/30 font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-3">
                <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
                End of List
                <span className="w-12 h-[1px] bg-border-slate/50 dark:bg-white/10"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesGrid;
