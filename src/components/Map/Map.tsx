import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

enum Rol {
  ADMIN,
  VENDEDOR,
}
interface Usuario {
  nombre: string;
  id: number;
  rol: Rol;
  prospectos: Prospectos[];
}

enum Estado {
  EN_PROSPECTO = "EN_PROSPECTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

interface Prospectos {
  estado: Estado;
  inicio: string;
  nombreCompleto: string;
  empresaTienda: string;
}

interface locationReceived {
  latitud: number;
  longitud: number;
  usuarioId: number;
  usuario: Usuario;
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

  // const prospectos = locations.map((pros) => pros.prospectos);

  console.log("Las localizaciones son: ", locations);

  // Cambia esta línea:
  // const prospectos = locations.map((pros) => pros.prospectos);

  // A esto:
  const prospectos = locations.map((loc) => loc.usuario.prospectos);

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
      options={mapOptions} // Agrega las opciones aquí
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

            {/* Muestra los prospectos si existen */}
            {selectedLocation.usuario.prospectos &&
            selectedLocation.usuario.prospectos.length > 0 ? (
              selectedLocation.usuario.prospectos.map((pros, index) => (
                <div key={index}>
                  <h3 style={infoWindowTitleStyle}>
                    {pros.estado === Estado.EN_PROSPECTO
                      ? `En prospecto con ${
                          pros.nombreCompleto && pros.empresaTienda
                            ? `${pros.nombreCompleto} de ${pros.empresaTienda}`
                            : pros.nombreCompleto
                            ? pros.nombreCompleto
                            : pros.empresaTienda
                            ? pros.empresaTienda
                            : "Información no disponible"
                        }`
                      : pros.estado === Estado.FINALIZADO
                      ? `Finalizando prospecto con ${
                          pros.nombreCompleto
                            ? pros.nombreCompleto
                            : "Cliente desconocido"
                        }`
                      : "Prospecto Cancelado"}
                  </h3>
                  <h3 style={infoWindowTitleStyle}>
                    Comenzó: {new Date(pros.inicio).toLocaleDateString()} a las{" "}
                    {new Date(pros.inicio).toLocaleTimeString()}
                  </h3>
                </div>
              ))
            ) : (
              <h3>No hay prospectos activos</h3>
            )}
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
