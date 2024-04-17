export interface MemoType {
  _id?: string;
  uid: string;
  name: string;
  date: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  description: string;
  media?: string[];
}
