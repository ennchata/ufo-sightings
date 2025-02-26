export type Sighting = {
    id: number,
    witnessName: string,
    location: Location,
    description: string,
    picture: string,
    status: string,
    dateTime: Date,
    witnessContact: string
};

export type Location = {
    latitude: number,
    longitude: number
}
