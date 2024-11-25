interface Route {
    name: string;
    host: string;
    pathTransform?: string;
    port: string;
    path?: string;
    primary: boolean;
    type: string;
    status: string;
}

interface ChannelConfig {
    name: string;
    urlPattern: string;
    routes: Route[];
    allow: string[];
    methods: string[];
    type: string;
}

interface Endpoint {
    name: string;
    host: string;
    path: string;
    port: string;
    primary: boolean;
    type: string;
    status: string;
}

interface Mediator {
    urn: string;
    version: string;
    name: string;
    description: string;
    defaultChannelConfig: ChannelConfig;
    endpoints: Endpoint[];
}

export { Mediator, ChannelConfig, Route, Endpoint };
