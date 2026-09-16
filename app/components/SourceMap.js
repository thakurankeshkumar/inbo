"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SourceMap({ latitude, longitude, city, country, ip }) {
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return null;
    }

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <MapContainer
                center={[latitude, longitude]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "320px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <div className="text-sm">
                            <strong>Source Infrastructure</strong>
                            <br />
                            {city}, {country}
                            <br />
                            IP: {ip}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}