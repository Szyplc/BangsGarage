import { useState, useEffect } from 'react'
import "./AddPhotoToProfileGallery.css"
import { storage } from "../../../base";
import axios, { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../Store/authSlice';
import { Car, loadCarsData } from '../../../Store/carSlice';
import { AppDispatch } from '../../../Store/store';

const AddPhotoToProfileGallery = () => {
    const [titleValue, setTitleValue] = useState('')
    const [currentFile, setCurrentFile] = useState<Blob | null>(null)
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector(getUser)
    const car = useSelector(Car)
    const [carId, setCarId] = useState(car?._id || "")
    const [filePath, setFilePath] = useState<string>(user?.uid + "/" + car?._id || "" + "/")
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
      setCarId(car?._id || "")
      setFilePath(user?.uid + "/" + car?._id || "" + "/")
      setImageSource(car?.profileUrl || "")
    }, [car])

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
            fullUrl: fullUrl,
            profile: true,
            carId: car?._id
          };
          console.log(postData)
          await axios.post("http://127.0.0.1:3000/post_photo_to_gallery", postData, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error) => {
            console.error("Wystąpił błąd:", error);
          });
        let profilemedia = car?.media.find(car => car.profile === true)
        if(profilemedia)
          await axios.delete("http://127.0.0.1:3000/delete_photo", { data: { _id: profilemedia?._id }})
        
        setTitleValue("")
        setCurrentFile(null);
        await dispatch(loadCarsData())
    }

    /*const updateCarImageProfile = (name: string) => {
        axios.put("http://127.0.0.1:3000/updateCarMedia", { image: name, carId: carId, profile: true }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
    }*/

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
