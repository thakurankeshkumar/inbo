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

    return { authentication, received, findings }
}