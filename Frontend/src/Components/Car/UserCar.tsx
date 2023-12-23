import React, { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../Auth/AuthContext";

function UserCar() {
    const { user } = useContext(AuthContext);
    
  
  return (
    <div id="container">
        Elo
    </div>
  );
}

export default UserCar;
