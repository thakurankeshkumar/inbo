export async function geolocateIP(ip) {
    if (!ip) {
        return null;
    }

    try {
        const response = await fetch(
            `https://ipwho.is/${encodeURIComponent(ip)}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`IP geolocation failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            return null;
        }

        return {
            ip: data.ip,
            country: data.country,
            countryCode: data.country_code,
            region: data.region,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            isp: data.connection?.isp || null,
            organization: data.connection?.org || null,
            asn: data.connection?.asn || null,
        };
    } catch (error) {
        console.error("IP geolocation error:", error);
        return null;
    }
}