import { Plane, Car, TrainFront, Bus } from 'lucide-vue-next'

// Mirrors backend/src/constants/travel.js. Labels come from i18n: transport.<value>
export const TRANSPORT_OPTIONS = Object.freeze([
  { value: 'PESAWAT', icon: Plane },
  { value: 'MOBIL_DINAS', icon: Car },
  { value: 'KERETA', icon: TrainFront },
  { value: 'BUS', icon: Bus },
])
