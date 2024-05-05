import Header from "./Header";
import Map from "./Map";
import SideBar from "./SideBar";
import BtnToResizeComponent from "./BtnToResizeComponent";
import BtnToMyLocation from "./BtnToMyLocation";
import PlaceList from "./PlaceList";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import "../assets/App.css";

function App() {
  const { t } = useTranslation();
  const [resize, setResize] = useState(false);
  const [openFiltered, setOepnFiltered] = useState(false);
  const [shippingFiltered, setShippingFiltered] = useState(false);
  const [dineInFiltered, setDineInFiltered] = useState(false);
  const [distanceFiltered, setDistanceFiltered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const d = new Date();
  const today = d.getDay();
  const currentHour = d.getHours();
  const currentMin = d.getMinutes();
  const currentTime = Number(`${currentHour}.${currentMin}`);
  const initialData = t("bakeries", { returnObjects: true });

  useEffect(() => {
    document.title = t("header.title");
  }, [t]);

  useEffect(() => {
    const success = function (position) {
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };
    const error = function () {
      setCurrentLocation({
        latitude: 35.1641776,
        longitude: 129.1181663,
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Calculate differences in coordinates
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate distance in kilometers
    const distance = R * c;

    return distance;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function filterData(initalData, filterOptions) {
    let output = initalData;
    const [
      today,
      currentTime,
      openFiltered,
      shippingFiltered,
      dineInFiltered,
      distanceFiltered,
    ] = filterOptions;

    if (openFiltered) {
      const openFilteredData = initalData
        .filter((bakery) => bakery.hours[today].open)
        .filter(
          (bakery) =>
            Number(
              `${bakery.hours[today].open.hour}.${bakery.hours[today].open.min}`
            ) <= currentTime &&
            currentTime <
              Number(
                `${bakery.hours[today].close.hour}.${bakery.hours[today].close.min}`
              )
        );

      output = openFilteredData;

      if (dineInFiltered)
        output = openFilteredData.filter((bakery) => bakery.dineIn);

      if (shippingFiltered)
        output = openFilteredData.filter((bakery) => bakery.shippingService);

      if (distanceFiltered)
        output = openFilteredData
          .slice()
          .sort((a, b) => a.distance - b.distance);

      if (dineInFiltered && shippingFiltered)
        output = openFilteredData.filter(
          (bakery) => bakery.dineIn && bakery.shippingService
        );

      if (dineInFiltered && distanceFiltered)
        output = openFilteredData
          .slice()
          .sort((a, b) => a.distance - b.distance)
          .filter((bakery) => bakery.dineIn);

      if (shippingFiltered && distanceFiltered)
        output = openFilteredData
          .filter((bakery) => bakery.shippingService)
          .sort((a, b) => a.distance - b.distance);

      if (dineInFiltered && shippingFiltered && distanceFiltered)
        output = openFilteredData
          .filter((bakery) => bakery.shippingService)
          .sort((a, b) => a.distance - b.distance)
          .filter((bakery) => bakery.dineIn);
    } else if (dineInFiltered) {
      const dineInFilteredData = initalData.filter((bakery) => bakery.dineIn);

      output = dineInFilteredData;

      if (shippingFiltered)
        output = dineInFilteredData.filter((bakery) => bakery.shippingService);

      if (distanceFiltered)
        output = dineInFilteredData
          .slice()
          .sort((a, b) => a.distance - b.distance);

      if (shippingFiltered && distanceFiltered)
        output = dineInFilteredData
          .filter((bakery) => bakery.shippingService)
          .slice()
          .sort((a, b) => a.distance - b.distance);
    } else if (shippingFiltered) {
      const shippingFilteredData = initalData.filter(
        (bakery) => bakery.shippingService
      );

      output = shippingFilteredData;

      if (distanceFiltered)
        output = shippingFilteredData
          .slice()
          .sort((a, b) => a.distance - b.distance);
    } else if (distanceFiltered) {
      const distanceFilteredData = initalData
        .slice()
        .sort((a, b) => a.distance - b.distance);

      output = distanceFilteredData;
    }

    return output;
  }

  const distanceArr = initialData.map((bakery) =>
    Number(
      calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        bakery.location.latitude,
        bakery.location.longitude
      ).toFixed(2)
    )
  );

  const modifiedData = initialData.map((bakery, i) => {
    return { ...bakery, distance: distanceArr[i] };
  });

  return (
    <div className="container">
      <Header>
        <BtnToResizeComponent resize={resize} setResize={setResize} />
        <BtnToMyLocation resize={resize} />
      </Header>
      <SideBar
        openFiltered={openFiltered}
        dineInFiltered={dineInFiltered}
        shippingFiltered={shippingFiltered}
        distanceFiltered={distanceFiltered}
        setOepnFiltered={setOepnFiltered}
        setShippingFiltered={setShippingFiltered}
        setDineInFiltered={setDineInFiltered}
        setDistanceFiltered={setDistanceFiltered}
      >
        <PlaceList
          bakeryData={modifiedData}
          currentLocation={currentLocation}
          today={today}
          currentTime={currentTime}
          openFiltered={openFiltered}
          distanceFiltered={distanceFiltered}
          dineInFiltered={dineInFiltered}
          shippingFiltered={shippingFiltered}
          filterData={filterData}
        />
      </SideBar>
      <Map
        bakeryData={modifiedData}
        currentLocation={currentLocation}
        today={today}
        currentTime={currentTime}
        openFiltered={openFiltered}
        shippingFiltered={shippingFiltered}
        dineInFiltered={dineInFiltered}
        distanceFiltered={distanceFiltered}
        filterData={filterData}
      />
    </div>
  );
}

export default App;
