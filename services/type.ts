export type GetTotalData<T> = {
    content: T[];
    size: number;
    sort: [];
    totalElements: number;
    totalPages: number;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: 0;
        pageNumber: 0;
        pageSize: 6;
        paged: true;
        sort: [];
        unpaged: false;
    };
};

export type LoginRequest = {
    username: string;
    password: string;
    otpStrategyTypeId: number;
    otpCode: string;
};

export type LoginResponse = {
    token: string;
};

export type SendOtpForLoginRequest = {
    username: string;
    password: string;
    otpStrategyTypeId: number;
}

export type MutationResponse = 0 | 1;

export type IdRequest = { id: number };
