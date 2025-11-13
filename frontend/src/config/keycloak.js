import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'user-management-realm',
    clientId: 'user-management-client',
});

export default keycloak;