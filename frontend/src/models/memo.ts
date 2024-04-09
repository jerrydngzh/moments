export interface MemoType {
  id?: string,
  name: string,
  description: string,
  date: string,
  location: {
    name: string,
    coordinates: [number, number]
  },
  media?: string[]
  tags?: string[]
}