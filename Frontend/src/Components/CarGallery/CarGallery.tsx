import React, { ChangeEvent, useState, useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import { EffectFade } from "swiper/modules";
import "./CarGallery.css"
import { storage } from "../../base"
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { CarData, Media } from "../../types/types";
import { useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface Image {
    name: string,
    src: string,
}

const CarGallery = () => {
    const location = useLocation();
    const [car, setCar] = useState<CarData>(location.state?.car as CarData)
    const [selectedPhoto, setSelectedPhoto] = useState<string>("")
    const [photos, setPhotos] = useState<Image[]>([
        { src: "https://ocdn.eu/pulscms-transforms/1/27Kk9kpTURBXy8yNTA4MDY4Nzk1MTBlZWJiOWQ5MGIyMWQ5MWU4OWUzNi5qcGeRkwXNBLDNAqTeAAKhMAWhMQA", name: "a" },
        { src: "https://ocdn.eu/pulscms-transforms/1/NFmk9kqTURBXy9jOTY2MDYxNGI1YWMyNTg2OGYxZGI2MmYxNzc0NmI2Ny5qcGVnkpUDAMywzQZAzQOEkwXNBLDNAqTeAAKhMAWhMQA", name: "a" },
        { src: "https://babolat-tenis.pl/10924-thickbox_default/babolat-jet-tere-ac-m-white-dark-blue.jpg", name: "a" },
        { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS86VcY5DTSvLP4FOVYCbHzxR4lStSyftNaXg&usqp=CAU", name: "a" }
    ])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();
    const {
        user,
      } = useContext(AuthContext);

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
        if(selectedPhoto != "")
        {
            setPhotos((prevPhotos) => [...prevPhotos, { src: selectedPhoto, name: fileInputRef.current?.files?.[0].name as string }])
            const file = fileInputRef.current?.files?.[0] as File;
            //dodawanie do firebase
            const storageRef = storage.ref();
            let name = user?.uid + "/" + car._id + "/" + fileInputRef.current?.files?.[0].name;
            const fileRef = storageRef.child(name);
            await fileRef.put(file)
            const url = await fileRef.getDownloadURL()
            let newCarObjRes = await axios.put("http://127.0.0.1:3000/updateCarMedia", { image: url, carId: car._id, profile: false }, {
                headers: {
                "Content-Type": "application/json",
                }
            })
            .catch((error: AxiosError) => {
                console.error("Wystąpił błąd:", error);
            })
            let newCarObj = newCarObjRes?.data as CarData
            setCar(newCarObj)

            if(fileInputRef.current)
                fileInputRef.current.value = "";
            setSelectedPhoto("")
        }
    }

    const undo = () => {
        navigate(-1);
    }

  return (
    <div className="container" style={{ display: "block", height: "initial"}}>
        <button onClick={undo}>Cofnij</button>
       <Swiper
       modules={[Navigation, Pagination, EffectFade]}
            effect="fade"
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            centeredSlides={true}
       >
        {car.media.map((media) => (
            <SwiperSlide style={{ textAlign: "center"}} key={media.fullUrl}><div style={{ background: "white", height: "100%"}}>
                <img style={{ objectFit: "contain" }} src={media.fullUrl} />
                </div></SwiperSlide>
        ))}
       </Swiper>
       <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} />
            <img src={selectedPhoto} alt="Tutaj będzie twoje wybrane zdjęcie" 
                style={{ maxWidth: '100%', height: 'auto' }} />
            <button onClick={addPhoto}>Dodaj</button>
        </div>
    </div>
  );
};

export default CarGallery;