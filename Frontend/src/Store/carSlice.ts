import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CarData, Media } from '../types/types'; // Adjust the import paths as necessary
import { RootState } from './store';
import { convertUrlToFullUrl } from '../base';

interface CarState {
  cars_id: string[];
  carData: CarData | null;
  carsData: CarData[] | null
}

const initialState: CarState = {
  cars_id: [],
  carData: null,
  carsData: null
};

// Async thunk for fetching cars IDs
export const getCarsId = createAsyncThunk<string[]>(
  'car/getCarsId',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<string[]>("http://127.0.0.1:3000/getUserCars");
      return response.data;
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);

// Async thunk for fetching car data
export const getCarData = createAsyncThunk<CarData | null, string>(
  'car/getCarData',
  async (car_id, { rejectWithValue }) => {
    try {
      const response = await axios.get<CarData>(`http://127.0.0.1:3000/getCarData`, {
        params: { car_id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const loadCarsData = createAsyncThunk<CarData[] | null, void, { state: RootState }>(
    'car/loadCarsData',
    async (_, { getState, dispatch, rejectWithValue }) => {
      try {
        let { cars_id } = getState().car;
        if (!cars_id.length) {
          await dispatch(getCarsId());
          cars_id = getState().car.cars_id; // Ponowne pobranie cars_id po aktualizacji
        }
  
        if (!cars_id.length) {
          console.error("Brak cars_id w stanie.");
          return null;
        }
  
        const carsDataPromises = cars_id.map(async (car_id) => {
          try {
            const carData = await dispatch(getCarData(car_id)).unwrap() as CarData | null;
            if (!carData) return null;
  
            const updatedMedia = await Promise.all(carData.media.map(async media => ({
              ...media,
              fullUrl: await convertUrlToFullUrl(media.url)
            })));

            const profileUrl = updatedMedia.find(m => m.profile)?.fullUrl || 'domyślny_url_obrazka';
  
            return { ...carData, media: updatedMedia, profileUrl };
          } catch (error) {
            console.error(`Błąd podczas ładowania danych samochodu o ID ${car_id}:`, error);
            return null;
          }
        });
  
        let carsData = await Promise.all(carsDataPromises);
        carsData = carsData.filter((car): car is CarData => car !== null);
  
        if (!carsData.length) {
          return null;
        }
        return carsData;
      } catch (error) {
        console.error("Błąd podczas ładowania danych samochodów:", error);
        return rejectWithValue({ message: "Nie udało się załadować danych samochodów." });
      }
    }
  );

export const getFullUrl = createAsyncThunk<CarData, CarData, { state: RootState }>(
    'car/getFullUrl',
    async (CarData) => {
         if(CarData) {
            for(const [index, media] of CarData.media.entries()) {
                const fullUrl = await convertUrlToFullUrl(media.url)
                CarData.media[index] = { ...media, fullUrl: fullUrl }
            }
            const carProfileFullUrl = CarData.media.find(obj => obj.profile === true)?.url
            CarData.profileUrl = carProfileFullUrl ? await convertUrlToFullUrl(carProfileFullUrl) : ""
        }
        return CarData
    }
)

export const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    setCarsId: (state, action: PayloadAction<string[]>) => {
      state.cars_id = action.payload;
    },
    setCar: (state, action: PayloadAction<string>) => {
        const car = state.carsData?.find(car => car._id == action.payload) as CarData || undefined
        if(car)
            state.carData = car
        else 
            state.carData = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCarsId.fulfilled, (state, action) => {
      state.cars_id = action.payload;
    });
    builder.addCase(getCarData.fulfilled, (state, action) => {
      //state.carData = action.payload;
    });
    builder.addCase(loadCarsData.fulfilled, (state, action) => {
        state.carsData = action.payload
        const currentCarId = state.carData?._id;
        const updatedCurrentCar = state.carsData?.find(car => car._id === currentCarId);
        // Jeśli samochód jest dostępny w nowych danych, zaktualizuj carData, w przeciwnym razie ustaw na null
        state.carData = updatedCurrentCar ? updatedCurrentCar : null;
    }),
    builder.addCase(getFullUrl.fulfilled, (state, action) => {
        state.carData = action.payload
    })
  },
});

export const CarsId = ( state: RootState ) => state.car.cars_id;
export const CarsData = ( state: RootState ) => state.car.carsData;
export const Car = ( state: RootState ) => state.car.carData

export const { setCarsId, setCar } = carSlice.actions;

export default carSlice.reducer;
