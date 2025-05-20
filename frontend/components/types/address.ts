export interface Address {
    AddressId: number;
    AddressNM: string;
    StreetNMBR: string;
    PrimaryStreetNM: string;
    SecondaryStreetNM?: string;
    City: string;
    StateNM: string;
    Zipcode: string;
    Date_Created: string;
    Date_Modified: string;
    isHome?: boolean;
}