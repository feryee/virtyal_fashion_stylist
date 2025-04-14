import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode";

const RecentActivity = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenData = getLocal();

        let userId = null;
        let access = null;
        const parsedToken = JSON.parse(tokenData);
        access = parsedToken.access;
        const decoded = jwtDecode(access);
        userId = decoded?.user_id;

        const response = await axios.get(`${BASE_URL}api/recent-activities/${userId}/`);

        console.log("Raw response hereee:", response.data);

        // Transform data into group-by-date format with time
        const grouped = {};
        response.data.forEach((activity) => {
          const dateObj = new Date(activity.saved_at);
          const dateStr = dateObj.toLocaleDateString();
          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          if (!grouped[dateStr]) grouped[dateStr] = [];

          const imageUrl = activity.item.image.startsWith("http")
            ? activity.item.image
            : `${BASE_URL}${activity.item.image}`;

          grouped[dateStr].push({
            id: activity.item.id,
            image: imageUrl,
            alt: activity.item.name,
            time: timeStr, // Add time to each item
            saved_at: activity.saved_at // Keep original timestamp for sorting
          });
        });

        // Sort items within each date group by time (newest first)
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
        });

        // Convert to array and sort by date (newest first)
        const formatted = Object.entries(grouped)
          .map(([date, items]) => ({
            date,
            items,
          }))
          .sort((a, b) => new Date(b.items[0].saved_at) - new Date(a.items[0].saved_at));

        console.log("Formatted Data:", formatted);
        setActivityData(formatted);
      } catch (error) {
        console.error("Failed to load recent activities", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-10 w-full mx-auto pt-26 bg-stone-50 p-4">
      {activityData.map((activity) => (
        <div
          key={activity.date}
          className="mb-6 bg-white rounded-lg shadow-sm p-5"
        >
          <h2 className="text-lg font-medium mb-4">{activity.date}</h2>
          <div className="flex flex-wrap gap-4">
            {activity.items.map((item) => (
              <div
                key={item.id}
                className="w-20 h-auto rounded-md overflow-hidden border border-gray-100 text-center"
              >
                <div className="w-full h-16 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs mt-1">{item.alt}</p>
                <p className="text-xs text-gray-500">{item.time}</p> {/* 👈 Display time */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;