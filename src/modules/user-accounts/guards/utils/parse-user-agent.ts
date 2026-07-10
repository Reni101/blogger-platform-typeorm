export function parseUserAgent(userAgent: string): string {
    if (!userAgent) {
        return '';
    }

    let browserName: string;

    if (/SamsungBrowser/i.test(userAgent)) {
        browserName = 'Samsung Internet';
    } else if (/OPR\/|Opera/i.test(userAgent)) {
        browserName = 'Opera';
    } else if (/Edg\//i.test(userAgent)) {
        browserName = 'Edge';
    } else if (/Firefox\//i.test(userAgent)) {
        browserName = 'Firefox';
    } else if (/Chrome\//i.test(userAgent)) {
        browserName = 'Chrome';
    } else if (/Safari\//i.test(userAgent)) {
        browserName = 'Safari';
    } else if (/MSIE |Trident\//i.test(userAgent)) {
        browserName = 'Internet Explorer';
    } else {
        browserName = 'Unknown';
    }

    return `browser ${browserName}`;
}
