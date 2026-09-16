export function extractUrls(text) {
    if (!text) { return []; }
    const urlRegex = /https?:\/\/[^\s<>"']+/gi;
    const matches = text.match(urlRegex) || [];
    return [...new Set(matches)];
}

export function analyzeUrls(text) {
    const urls = extractUrls(text);

    return urls.map((url) => {
        try {
            const parsedUrl = new URL(url);

            const urlData = {
                url,
                domain: parsedUrl.hostname,
                protocol: parsedUrl.protocol,
                https: parsedUrl.protocol === "https:",
            };

            return {
                ...urlData,
                findings: checkSuspiciousUrl(urlData),
            };

        } catch {
            return {
                url,
                domain: "",
                protocol: "",
                https: false,
                findings: [],
            };
        }
    });
}

function checkSuspiciousUrl(urlData) {
    const findings = [];

    try {
        const parsedUrl = new URL(urlData.url);
        const hostname = parsedUrl.hostname;

        // IP address used instead of a domain
        const ipPattern =
            /^(?:\d{1,3}\.){3}\d{1,3}$/;

        if (ipPattern.test(hostname)) {
            findings.push({
                type: "IP_URL",
                severity: "high",
                description:
                    "The URL uses an IP address instead of a domain name.",
            });
        }

        // Punycode / IDN
        if (hostname.includes("xn--")) {
            findings.push({
                type: "PUNYCODE_DOMAIN",
                severity: "medium",
                description:
                    "The domain uses punycode, which can be relevant to lookalike-domain attacks.",
            });
        }

        // Very long hostname
        if (hostname.length > 60) {
            findings.push({
                type: "LONG_DOMAIN",
                severity: "medium",
                description:
                    "The domain name is unusually long.",
            });
        }

        // Excessive subdomains
        const parts = hostname.split(".");

        if (parts.length >= 5) {
            findings.push({
                type: "MANY_SUBDOMAINS",
                severity: "medium",
                description:
                    "The URL contains an unusually large number of subdomains.",
            });
        }

        return findings;

    } catch {
        return [];
    }
}