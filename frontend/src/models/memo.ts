export interface MemoType {
  id?: string,
  name: string,
  description: string,
  date: string,
  location: {
    name: string,
    coordinates: [Number, Number]
  },
  media?: string[]
  tags?: string[]
}