import { ChangeEvent, useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import "./CarGallery.css"
import { storage } from "../../base"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Car, CarsData, loadCarsData, setCarByCar, setCarById } from "../../Store/carSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../Store/authSlice";
import { AppDispatch } from "../../Store/store";
import { Swiper as SwiperClass } from "swiper/types";
import { CarData } from "../../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faGear, faImage, faPlus, faRotateLeft, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { CurrentTheme } from "../../Store/themeSlice";

const CarGallery = () => {
    const car = useSelector(Car)
    const user = useSelector(getUser)
    const dispatch = useDispatch<AppDispatch>()
    const cars = useSelector(CarsData)
    //check if it is your car
    const result = cars.find(c => c._id == car?._id)
    const [isYourCar, setIsYourCar] = useState<boolean>(Boolean(result))
    const [selectedPhoto, setSelectedPhoto] = useState<string>("")
    const [currentIndex, setCurrentIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const currentTheme = useSelector(CurrentTheme)
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(car)
        if(!car)
            navigate("/profile")
    }, [])

    const handleSlideChange = (swiper: SwiperClass) => {
        setCurrentIndex(swiper.realIndex);
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if(typeof e.target?.result == "string")
                    setSelectedPhoto(e.target?.result)
            }
            reader.readAsDataURL(file);
        }
    }

    const addPhoto = async () => {
        if(selectedPhoto != "" && car != undefined)
        {
            const file = fileInputRef.current?.files?.[0] as File;
            //dodawanie do firebase
            const storageRef = storage.ref();
            let name = user?.uid + "/" + car._id + "/" + fileInputRef.current?.files?.[0].name;
            const fileRef = storageRef.child(name);
            await fileRef.put(file)
            //const url = await fileRef.getDownloadURL()
            await axios.put("http://127.0.0.1:3000/updateCarMedia", { image: name, carId: car._id, profile: false }, {
                headers: {
                "Content-Type": "application/json",
                }
            })
            .catch((error: AxiosError) => {
                console.error("Wystąpił błąd:", error);
            })

            if(fileInputRef.current)
                fileInputRef.current.value = "";
            setSelectedPhoto("")
            dispatch(loadCarsData())
        }
    }

    const undo = () => {
        dispatch(setCarById(""))
        navigate(-1);
    }

    const deleteButton = async () => {
        if (car && car.media && currentIndex >= 0 && currentIndex < car.media.length) {
            await axios.delete("http://127.0.0.1:3000/delete_photo", { data: { _id: car?.media[currentIndex]._id } })
            let newCar = { ...car } as CarData
            newCar.media = newCar.media.filter((_, index) => index !== currentIndex);
            const updatedCar = { ...newCar, 
            profileUrl: "https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_car.png?alt=media&token=2ae582b6-ad31-4987-8f6c-39114743aa64"}
            dispatch(setCarByCar(updatedCar))
          }
    }

    const goConfig = () => {
        navigate("/carConfig")
    }

  return (
    (car &&
        <div className="container" style={{ display: "block", height: "initial", paddingTop: 0, backgroundColor: currentTheme.LightGray}}>
            <div style={{ borderBottom: "2px white solid", marginBottom: "3px", backgroundColor: currentTheme.Background }}>
                <FontAwesomeIcon onClick={undo} style={{ height: "35px", width: "35px", padding: 10, color: currentTheme.White }} icon={faRotateLeft} />
                { isYourCar && <FontAwesomeIcon onClick={goConfig} 
                style={{ height: "35px", width: "35px", float: "right", padding: 10, color: currentTheme.White }} icon={faGear} /> }
                
                <FontAwesomeIcon style={{ padding: 10, marginRight: "10px", float: "right", display: isYourCar ? "inherit": "none", height: "35px", width: "35px", color: currentTheme.White}} onClick={deleteButton} icon={faTrash} />
            </div>
            <div style={{ height: "70vh" }}>
                <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                        effect="fade"
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        centeredSlides={true}
                        loop={true}
                        onSlideChange={handleSlideChange}
                >
                    {car.media.map((media) => (
                        <SwiperSlide style={{ textAlign: "center"}} key={media._id}><div style={{ background: currentTheme.LightGray, height: "100%"}}>
                            {media.fullUrl && <img style={{ objectFit: "contain" }} src={media.fullUrl} alt={media.fullUrl} /> }
                            </div></SwiperSlide>
                    ))}
                </Swiper>
            </div>
        { isYourCar && <div>
                <div style={{ display: "flex", justifyContent: selectedPhoto != "" ? "space-around" : "flex-start", backgroundColor: currentTheme.HotGray, borderBottom: "1px solid black",borderTop: "1px solid black",
                marginTop: "5px", marginBottom: "5px", padding: "5px" }}>
                <div style={{ display: selectedPhoto == "" ? "contents" : "none"}}>
                    <label htmlFor="file-input" style={{ verticalAlign: "center", margin: "10px"}}>
                        <FontAwesomeIcon style={{ height: "50px", color: currentTheme.White }} icon={faImage} />
                    </label>
                    <input style={{ display: "none"}} id="file-input" ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} />
                </div>
                <FontAwesomeIcon style={{ display: selectedPhoto != "" ? "inherit": "none", height: "50px", color: currentTheme.White }} icon={faX} onClick={() => setSelectedPhoto("")}/>
                <FontAwesomeIcon onClick={addPhoto} style={{ width: "50px", height: "50px", display: selectedPhoto == "" ? "none" : "inherit", color: currentTheme.White}} icon={faPlus} />
                </div>
                <div style={{ textAlign: "center" }}>{selectedPhoto && <img src={selectedPhoto} alt="Tutaj będzie twoje wybrane zdjęcie" 
                    style={{ maxWidth: '100%', height: "50vh" }} />}</div>
            </div> }
        </div>
    )
  );
};

export default CarGallery;