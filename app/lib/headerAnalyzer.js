export function analyzeAuthentication(headers) {
    const authenticationHeader = headers.find((header) => header.name.toLowerCase() === "authentication-results");
    if (!authenticationHeader) {
        return {
            spf: "unkown",
            dkim: "unkown",
            dmarc: "unkown",
        };
    }

    const value = authenticationHeader.value.toLowerCase();

    const spf = value.match(/\bspf=(pass|fail|softfail|neutral|none|temperror|permerror)\b/);
    const dkim = value.match(/\bdkim=(pass|fail|neutral|none|temperror|permerror)\b/);
    const dmarc = value.match(/\bdmarc=(pass|fail|bestguesspass|none|temperror|permerror)\b/);

    return {
        spf: spf?.[1] || "Unknown",
        dkim: dkim?.[1] || "Unknown",
        dmarc: dmarc?.[1] || "Unknown",
    };
}

export function getReceivedHeaders(headers) {
    return headers.filter((header) => header.name.toLowerCase() === "received").map((header) => header.value);
}


export function analyzeHeaders(headers) {
    const authentication = analyzeAuthentication(headers);
    const received = getReceivedHeaders(headers);
    const ips = extractIPsFromReceived(received);
    const findings = [];

    if (authentication.spf === "fail") {
        findings.push({
            type: "SPF",
            severity: "high",
            description: "SPF Authentication Failed",
        });
    }

    if (authentication.dkim === "fail") {
        findings.push({
            type: "DKIM",
            severity: "high",
            description: "DKIM Authentication Failed",
        });
    }
    if (authentication.dmarc === "fail") {
        findings.push({
            type: "DMARC",
            severity: "high",
            description: "DMARC Authentication Failed",
        });
    }
    console.log({ authentication, received, ips, findings })

    return { authentication, received, ips, findings }
}

export function extractIPsFromReceived(receivedHeaders) {
    if (!Array.isArray(receivedHeaders)) {
        return [];
    }

    const ips = [];

    for (const header of receivedHeaders) {
        // Most useful form in Received headers:
        // [209.85.220.69]
        const bracketedMatches =
            header.match(/\[((?:\d{1,3}\.){3}\d{1,3})\]/g) || [];

        for (const match of bracketedMatches) {
            const ip = match.slice(1, -1);

            if (isValidIPv4(ip) && !ips.includes(ip)) {
                ips.push(ip);
            }
        }
    }

    return ips;
}

function isValidIPv4(ip) {
    const octets = ip.split(".").map(Number);

    return (
        octets.length === 4 &&
        octets.every(
            (octet) =>
                Number.isInteger(octet) &&
                octet >= 0 &&
                octet <= 255
        )
    );
}