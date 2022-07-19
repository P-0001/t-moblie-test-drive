
declare global {

    interface Module {
        module: string;
        task_id?: string;
        useProxies?: boolean;
    }

    interface Proxy {
        host: string;
        port: string;
        username?: string;
        password?: string;
    };

    interface proxy {
        url: string;
        proxy: Proxy,
        status: {
            used: boolean;
        },
        number: number;
    };

    type ProxyList = Array<proxy>;

    interface Profile {
        address1: string;
        address2: string;
        city: string;
        zipCode: string;
        stateCode: string;
    };

    interface Data {
        address: {
            address1: string;
            address2?: string;
            city: string;
            stateCode: string;
            zipCode: string;
            geoCode: string;
            zipExtension: string;
            countryCode?: 'USA';
        };
        domain: string;
    }

    interface AuthTokenRequestBody {
        id_token: string;
        access_token: string;
        expires_in: number;
        token_type: string;
        resource: string;
        refresh_token: string;
        scope: string;
    }

    interface orderData { orderId: string; email: string; firstName: string; lastName: string; proxy: string; data: string; }

    interface taskDataTMobile {
        profile: Profile;
        domain: string;
        useProxies: boolean;
        sendHook: boolean;
        webhook?: string;
        mode: 'order' | 'check';
    }

    interface JiggerConfig {
        letters?: boolean;
        spaces?: boolean;
        inFront?: boolean;
        both?: boolean;
    }

}
export { };