import { ReactNode } from "react";

export interface Location {
    city: ReactNode;
    latitude: number;
    longitude: number;
  }
  
  export interface UfoSighting {
    id: number;
    witnessName: string;
    location: Location;
    description: string;
    picture: string;
    status: "confirmed" | "unconfirmed";
    dateTime: string;
    witnessContact: string;
    locationString?: string;
  }

