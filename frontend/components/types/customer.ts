import { Address } from './address';

export interface Customer {
    CustomerId: number;
    FirstNM: string;
    LastNM?: string;
    ShortDescription?: string;
    PrimaryEmail?: string;
    SecondaryEmail?: string;
    PrimaryPhoneNMBR: string;
    SecondaryPhoneNMBR?: string;
    HomeAddress?: number;
    Date_Created: string;
    Date_Modified: string;
    home_address?: Address;
}