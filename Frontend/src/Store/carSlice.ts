import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CarData } from '../../../types/types'; // Adjust the import paths as necessary
import { RootState } from './store';
import { convertUrlToFullUrl } from '../base';

interface CarState {
  cars_id: string[];
  carData: CarData | null;
  carsData: CarData[];
  carsToShow: CarData[];
  carToShowIndex: number;
}

const initialState: CarState = {
  cars_id: [],
  carData: null,
  carsData: [],
  carsToShow: [],
  carToShowIndex: 0,
};

export const getCarToShow = createAsyncThunk<CarData | null, number>(
  "car/getCarToShow",
  async (index, { rejectWithValue, }) => {
    try {
      const newCar = await (await axios.get("http://127.0.0.1:3000/getCarToSlider", { params: { index: index }})).data as CarData// | null
      if(newCar) {
        for(const [index, media] of newCar.media.entries()) {
            const fullUrl = await convertUrlToFullUrl(media.url)
            newCar.media[index] = { ...media, fullUrl: fullUrl }
        }
        const carProfileFullUrl = newCar.media.find(obj => obj.profile === true)?.url
        newCar.profileUrl = carProfileFullUrl ? await convertUrlToFullUrl(carProfileFullUrl) : ""
        return newCar;
      }
    } catch (err) {
      rejectWithValue(null)
    }
    return null
  }
)

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

export const loadCarsData = createAsyncThunk<CarData[], void, { state: RootState }>(
    'car/loadCarsData',
    async (_, { getState, dispatch, rejectWithValue }) => {
      try {
        await dispatch(getCarsId());
        let cars_id = getState().car.cars_id;
  
        if (!cars_id.length) {
          console.error("Brak cars_id w stanie.");
          return [];
        }
  
        const carsDataPromises = cars_id.map(async (car_id) => {
          try {
            const carData = await dispatch(getCarData(car_id)).unwrap() as CarData | null;
            if (!carData) return null;
  
            const updatedMedia = await Promise.all(carData.media.map(async media => ({
              ...media,
              fullUrl: await convertUrlToFullUrl(media.url)
            })));

            //domyślne zdjęcie url może uledz zmianie
            const profileUrl = updatedMedia.find(m => m.profile)?.fullUrl 
            || 'https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_car.png?alt=media&token=2ae582b6-ad31-4987-8f6c-39114743aa64';
            
            return { ...carData, media: updatedMedia, profileUrl };
          } catch (error) {
            console.error(`Błąd podczas ładowania danych samochodu o ID ${car_id}:`, error);
            return null;
          }
        });
  
        let carsData = await Promise.all(carsDataPromises);
        carsData = carsData.filter((car) => car !== null);

        if (!carsData.length) {
          return [];
        }
        
        return carsData as CarData[];
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
    setCarById: (state, action: PayloadAction<string>) => {
        const car = state.carsData?.find(car => car._id == action.payload) as CarData || undefined
        if(car)
            state.carData = car
        else 
            state.carData = null
    },
    setCarByCar: (state, action: PayloadAction<CarData>) => {
      state.carData = action.payload
      const index = state.carsData.findIndex(car => car._id === action.payload._id);
      if (index !== -1) {
        state.carsData = [
          ...state.carsData.slice(0, index),
          action.payload,
          ...state.carsData.slice(index + 1)
        ];
      }
    },
    setCarToShowIndex: (state, action: PayloadAction<number>) => {
      state.carToShowIndex = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCarsId.fulfilled, (state, action) => {
      state.cars_id = action.payload;
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
    }),
    builder.addCase(getCarToShow.fulfilled, (state, action) => {
      if(action.payload != null)
        if (!state.carsToShow.find(car => car._id === action.payload?._id))
          state.carsToShow.push(action.payload) 
    })
  },
});

export const CarsId = ( state: RootState ) => state.car.cars_id;
export const CarsData = ( state: RootState ) => state.car.carsData;
export const Car = ( state: RootState ) => state.car.carData
export const CarsToShow = ( state: RootState ) => state.car.carsToShow
export const CarToShowIndex = (state: RootState ) => state.car.carToShowIndex

export const { setCarsId, setCarByCar, setCarById, setCarToShowIndex } = carSlice.actions;

export default carSlice.reducer;
