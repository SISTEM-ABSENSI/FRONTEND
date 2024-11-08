import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { IStoreModel } from "../../models/storeModel";
import { useHttp } from "../../hooks/http";

export default function LocationView() {
  const { handleGetRequest } = useHttp();

  const [coordinates, setCoordintes] = useState<IStoreModel[]>([]);

  const handleGetStores = async () => {
    try {
      const result = await handleGetRequest({
        path: "/stores",
      });
      console.log(result);
      if (result && result?.data) {
        setCoordintes(result?.data?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStores();
  }, []);

  return (
    <MapContainer
      center={[-6.1754, 106.8272]}
      zoom={5}
      maxZoom={20}
      style={{
        height: "75vh",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {coordinates.map((item) => {
        return (
          <Marker
            key={item.storeId}
            position={[+item.storeLatitude, +item.storeLongitude]}
          >
            <Popup>
              <h1>{item?.storeName}</h1>
              <small>Latitude: {item.storeLatitude}</small>
              <small>Longitude: {item.storeLongitude}</small>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
