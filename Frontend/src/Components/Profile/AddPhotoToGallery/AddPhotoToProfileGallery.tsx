import { useState, useEffect } from 'react'
import "./AddPhotoToProfileGallery.css"
import { storage } from "../../../base";
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { getUser } from '../../../Store/authSlice';
import { Car } from '../../../Store/carSlice';

const AddPhotoToProfileGallery = () => {
    const [titleValue, setTitleValue] = useState('')
    const [currentFile, setCurrentFile] = useState<Blob | null>(null)
    const user = useSelector(getUser)
    const car = useSelector(Car)
    const [carId, setCarId] = useState(car?._id || "")
    const [filePath, setFilePath] = useState<string>(user?.uid + "/" + carId + "/")
    const [imageSource, setImageSource] = useState<string>(car?.profileUrl || "")

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setCurrentFile(file);
            setImageSource(URL.createObjectURL(file))
            setTitleValue(file.name)
        }
    };

    useEffect(() => {
        if(currentFile) {
            sendPhoto();
        }
    }, [currentFile])

    const sendPhoto = async () => {
        if(currentFile == null)
            return;

        let fullUrl = ""
        const storageRef = storage.ref();
        let name = filePath + titleValue;
        console.log(name)
        //let name = user?.uid + "/gallery/" + titleValue;//////////////////////
        const fileRef = storageRef.child(name);
        try {
            await fileRef.put(currentFile)
            const url = await fileRef.getDownloadURL()
            fullUrl = url
        } catch (error) {
            console.error(error)
        }
        
        const postData = {
            name: name,
            title: titleValue,
            fullUrl: fullUrl
          };
          await axios.post("http://127.0.0.1:3000/post_photo_to_gallery", postData, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error) => {
            console.error("Wystąpił błąd:", error);
          });
        let profilemedia = car?.media.find(car => car.profile === true)
        await axios.delete("http://127.0.0.1:3000/delete_photo", { data: { _id: profilemedia?._id }})
        
        setTitleValue("")
        updateCarImageProfile(name)
        setCurrentFile(null);
    }

    const updateCarImageProfile = (name: string) => {
        console.log(name)
        axios.put("http://127.0.0.1:3000/updateCarMedia", { image: name, carId: carId, profile: true }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
    }

    const isImage = () => { return imageSource != '' && imageSource != "domyślny_url_obrazka" }

    return (
        <>
            { isImage() ? ( <img src={imageSource} width={100} height={100}/> ) : "" }
            <input type='file' onChange={handleProfileImageChange} accept="image/*" />
            {/*<button>{ isImage() ? "Zmień" : "Dodaj" }</button>*/}
        </>
    )
}

export default AddPhotoToProfileGallery
