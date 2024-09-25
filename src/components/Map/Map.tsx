import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

interface locationReceived {
  latitud: number;
  longitud: number;
  usuarioId: number;
}

interface MyGoogleMapProps {
  locations: locationReceived[];
}

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const center = {
  lat: 15.6646, // Coordenadas iniciales
  lng: -91.7121,
};

const MyGoogleMap = ({ locations }: MyGoogleMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD_hzrV-YS5EaHDm-UK3jL0ny6gsJoj_18", // Tu API Key
  });

  const [selectedLocation, setSelectedLocation] =
    useState<locationReceived | null>(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={center}>
      {locations.map((location) => (
        <Marker
          key={location.usuarioId}
          position={{ lat: location.latitud, lng: location.longitud }}
          onClick={() => {
            setSelectedLocation(location); // Selecciona la localización cuando se hace clic
          }}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.latitud,
            lng: selectedLocation.longitud,
          }}
          onCloseClick={() => {
            setSelectedLocation(null); // Cierra el InfoWindow al hacer clic en cerrar
          }}
        >
          <div style={infoWindowStyle}>
            <h3 style={infoWindowTitleStyle}>
              Usuario ID: {selectedLocation.usuarioId}
            </h3>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const infoWindowStyle: React.CSSProperties = {
  padding: "5px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  maxWidth: "200px",
  position: "relative", // Para posicionar el botón de cierre
};

const infoWindowTitleStyle: React.CSSProperties = {
  margin: "0 0 5px 0",
  fontSize: "16px",
  fontWeight: "bold",
};

export default MyGoogleMap;
