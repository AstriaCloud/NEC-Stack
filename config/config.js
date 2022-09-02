// ====================================================== //
// ================ Create system object ================ //
// ====================================================== //
const system = {
    'port': '80', // Port to listen on
    'socket': '3000', // Socket port to listen on
    'version': '1.0.0', // Version of the system
    'proxy': '1', // Proxy bypass amount
    session: {
        secret: '',
        name: '',
    },
}

// ====================================================== //
// ================ Create domain object ================ //
// ====================================================== //

const domain = {
    'domain': "example.com", // Domain to listen on
    'protocol': 'https', // Protocol to listen on
    subdomain: {
        // api.domain.com
        'api': 'api',
        'api_enable': true,

        // cdn.domain.com
        'cdn': 'cdn',
        'cdn_enable': true,
    }
}

// ====================================================== //
// ================= Create seo object ================== //
// ====================================================== //
const seo = {
    'title': 'Example',
    'description': 'Example description here.',
    'favicon': 'https://cdn.example.com/image.png',
}

// ====================================================== //
// ================ Create links object ================= //
// ====================================================== //
const links = {
    'main': `${domain.protocol}://${domain.domain}`,
    'api': domain.subdomain.api_enable == true ? `${domain.protocol}://${domain.subdomain.api}.${domain.domain}` : `${domain.protocol}://${domain.domain}/api`,
    'cdn': domain.subdomain.cdn_enable == true ? `${domain.protocol}://${domain.subdomain.cdn}.${domain.domain}` : `${domain.protocol}://${domain.domain}/cdn`
};

// ====================================================== //
// ================ Create result object ================ //
// ====================================================== //
const result = {
    system,
    domain,
    seo,
    links,
}

// Export the result
module.exports = result;