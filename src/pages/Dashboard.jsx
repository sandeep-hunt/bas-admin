import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Helmet } from 'react-helmet';

const Dashboard = () => {

  const [apiData, setApiData] = useState({ counts: {}, recent: [] });
  const [loading, setLoading] = useState(true);  // Adding loading state

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [countsResponse, recentResponse] = await Promise.all([
        axios.get(import.meta.env.VITE_BACKEND_API + 'dasboard/count', {
          headers: { Authorization: token }
        }),
        axios.get(import.meta.env.VITE_BACKEND_API + 'dasboard/recent', {
          headers: { Authorization: token }
        })
      ]);
      
      setApiData({
        counts: countsResponse.data.counts,
        recent: recentResponse.data.recentEvents
      });
      setLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);  // Ensure loading is set to false even if there's an error
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const eventsData = apiData?.recent?.length > 0 ? 
    apiData?.recent?.map((event) => {
      return (
        <div key={event?.event_id} className="card bg-[#f5f5f5] rounded shadow-md w-[300px] cursor-pointer">
          <img
            src={`${import.meta.env.VITE_BACKEND_API}${event?.event_thumbnail}`}
            alt=""
            className="w-full h-[250px] p-1 rounded"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '../assets/dashboard_fallback_image.jpg'; 
            }}
          />
          <div className="p-2 mt-1 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <div className="whitespace-nowrap text-sm font-bold leading-5">Event Name:</div>
              <div className="block break-all text-sm font-medium leading-4">{event?.event_name}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="whitespace-nowrap text-sm font-bold leading-5">Event Date:</div>
              <div className="block break-all text-sm font-medium leading-4">{formatDate(event?.event_date)}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="whitespace-nowrap text-sm font-bold leading-5">Event Time:</div>
              <div className="block break-all text-sm font-medium leading-4">{formatTime(event?.event_time)}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="whitespace-nowrap text-sm font-bold leading-5">Event Location:</div>
              <div className="block break-all text-sm font-medium leading-4">{event?.event_location}</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="whitespace-nowrap text-sm font-bold leading-5">Event Price:</div>
              <div className="block break-all text-sm font-medium leading-4">{event?.event_price}</div>
            </div>
          </div>
        </div>
      );
    })
    : [];

  return (
    <React.Fragment>
    <Helmet>
        <title>Dashboard</title>
    </Helmet>
      <div className="w-full">
        <div>
          <Header />
        </div>

        {/* Loading Skeleton for Counts */}
        <div className="flex flex-row justify-between gap-4 items-center m-5  max-lg:flex-wrap min-[1024px]:flex-nowrap">
          {loading ? (
            [...Array(4)].map((_, idx) => (
              <div key={idx} className="card flex flex-col gap-1 bg-[#f5f5f5] rounded p-6 shadow-md w-[300px] text-center cursor-pointer">
                <Skeleton height={20} width={100} />
                <Skeleton height={40} width={150} className="mt-4" />
              </div>
            ))
          ) : (
            <>
              <div className="card flex flex-col gap-1 bg-[#f5f5f5] rounded p-6 shadow-md w-[300px] text-center cursor-pointer">
                <div className="text-sm font-semibold leading-4">Members</div>
                <div className="text-xl font-semibold leading-5">{apiData?.counts?.memberCount || "00"}</div>
              </div>
              <div className="card bg-[#f5f5f5] flex flex-col gap-1 rounded p-6 shadow-md w-[300px] text-center cursor-pointer">
                <div className="text-sm font-semibold leading-4">Category</div>
                <div className="text-xl font-semibold leading-5">{apiData?.counts?.categoryCount || "00"}</div>
              </div>
              <div className="card bg-[#f5f5f5] flex flex-col gap-1 rounded p-6 shadow-md w-[300px] text-center cursor-pointer">
                <div className="text-sm font-semibold leading-4">Blogs</div>
                <div className="text-xl font-semibold leading-5">{apiData?.counts?.blogCount || "00"}</div>
              </div>
              <div className="card bg-[#f5f5f5] flex flex-col gap-1 rounded p-6 shadow-md w-[300px] text-center cursor-pointer">
                <div className="text-sm font-semibold leading-4">Articles</div>
                <div className="text-xl font-semibold leading-5">{apiData?.counts?.articleCount || "00"}</div>
              </div>
            </>
          )}
        </div>

        {/* Loading Skeleton for Recent Events */}
        <div>
          <div className="flex justify-between items-center m-5">
            <h1 className="text-2xl font-bold">Recent Event</h1>
            <Link to={`/events`}>
              <button type="button" className="border p-2 rounded text-center text-sm font-semibold bg-green-600 text-white">
                View More
              </button>
            </Link>
          </div>

          <div className="flex flex-row gap-4 justify-between items-center m-5 max-lg:flex-wrap min-[1024px]:flex-nowrap">
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="card bg-[#f5f5f5] rounded shadow-md w-[300px] p-4">
                  <Skeleton height={250} />
                  <div className="mt-3">
                    <Skeleton height={20} width={100} />
                    <Skeleton height={15} width={150} className="mt-2" />
                    <Skeleton height={15} width={100} className="mt-2" />
                  </div>
                </div>
              ))
            ) : (
              eventsData
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;