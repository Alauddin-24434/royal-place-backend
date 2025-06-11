
// This file defines the interface for amenities in the application.
export interface Iamenities {

    
    name: string; // Name of the amenity
    description?: string; // Optional description of the amenity
    isActive: boolean; // Indicates if the amenity is currently active
    createdAt: Date; // Timestamp when the amenity was created
    updatedAt: Date; // Timestamp when the amenity was last updated

}