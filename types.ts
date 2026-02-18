
export enum DeliveryStatus {
  PENDING = 'Pendiente',
  DELIVERED = 'Entregado'
}

export interface Collaborator {
  id: string; // Cedula
  name: string;
  status: DeliveryStatus;
  deliveryDate?: string;
  serialNumber?: string;
  photoCollaborator?: string; // Base64
  photoActa?: string; // Base64
}

export interface Stats {
  total: number;
  pending: number;
  delivered: number;
}
