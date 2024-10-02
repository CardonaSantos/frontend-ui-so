import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

enum Rol {
  ADMIN = "ADMIN",
  VENDEDOR = "VENDEDOR",
}

enum Estado {
  EN_PROSPECTO = "EN_PROSPECTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

interface Asistencia {
  entrada: string; // fecha de entrada
  salida: string | null; // puede ser null si aún no ha salido
}

interface Prospecto {
  estado: Estado;
  inicio: string;
  nombreCompleto: string;
  empresaTienda: string;
}

interface Usuario {
  nombre: string;
  id: number;
  rol: Rol;
  prospecto: Prospecto | null; // Puede ser null
  asistencia: Asistencia | null; // Puede ser null
}

interface LocationReceived {
  latitud: number;
  longitud: number;
  usuarioId: number;
  usuario: Usuario;
  timestamp: string; // Timestamp de la ubicación
}

interface MyGoogleMapProps {
  locations: LocationReceived[];
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
    useState<LocationReceived | null>(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  console.log("Las localizaciones son: ", locations);

  const mapOptions = {
    mapTypeControl: true, // Habilita el control de tipo de mapa
    mapTypeControlOptions: {
      style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: window.google.maps.ControlPosition.TOP_LEFT, // Ajusta la posición del control
    },
    streetViewControl: false,
    fullscreenControl: true,
  };

  return (
    // <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={center}>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={mapOptions}
    >
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
          <div>
            <h3 style={infoWindowTitleStyle}>
              {selectedLocation.usuario.nombre}
            </h3>
            <h3 style={infoWindowTitleStyle}>
              Rol: {selectedLocation.usuario.rol}
            </h3>

            {selectedLocation &&
            selectedLocation.usuario.asistencia?.entrada ? (
              <div></div>
            ) : (
              <h3 style={infoWindowTitleStyle}>
                No hay registro de asistencia
              </h3>
            )}

            {/* Muestra el prospecto si existe */}
            {selectedLocation.usuario.prospecto ? (
              <div>
                <h3 style={infoWindowTitleStyle}>
                  En prospecto con{" "}
                  {selectedLocation.usuario.prospecto.nombreCompleto} de{" "}
                  {selectedLocation.usuario.prospecto.empresaTienda}
                </h3>
                <h3 style={infoWindowTitleStyle}>
                  Comenzó:{" "}
                  {new Date(
                    selectedLocation.usuario.prospecto.inicio
                  ).toLocaleDateString()}{" "}
                  a las{" "}
                  {new Date(
                    selectedLocation.usuario.prospecto.inicio
                  ).toLocaleTimeString()}
                </h3>
              </div>
            ) : (
              <h3 style={infoWindowTitleStyle}>No hay prospectos activos</h3>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const infoWindowTitleStyle: React.CSSProperties = {
  margin: "0 0 5px 0",
  fontSize: "16px",
  fontWeight: "bold",
};

export default MyGoogleMap;
