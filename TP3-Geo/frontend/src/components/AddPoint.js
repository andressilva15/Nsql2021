import React, { Fragment, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useHistory} from 'react-router'


export default function AddPoint() {

    const [place, setPlace] = useState('');
    const [placeName, setPlaceName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const history = useHistory();

    const handleChange = ip => {
        setPlace(ip);
    }

    const handleLngChange = lng => {
        setLongitude(lng);
    }

    const handleLatChange = lat => {
        setLatitude(lat);
    }

    const handleNameChange = pn => {
        setPlaceName(pn);
    }

    const sweetSucces = (res) => {
        Swal.fire(
            'Excelente!',
            `${res.data} agregado con éxito!`,
            'success'
        )
    }

    const sweetError = (err) => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `${err}`
          })
    }


    const handleSubmit = async e => {
        try{
            e.preventDefault();
            if(placeName!= null && latitude!= null && longitude!= null && place!=='Puntos de Interes'){
                axios.get(`http://localhost:5000/location/add/${place}/${longitude}/${latitude}/${placeName}`)
                .then((res) => {
                    console.log(res)
                    if(res.data!=='Error') {
                        sweetSucces(res);
                        history.replace('/');
                    } else {
                        sweetError("El lugar ya fue cargado.");
                    }
                })
                .catch((err) => {
                    return err;
                });
            } else {
                sweetError("Debe completar todos los campos.")
            }
        } catch (error) {
            return error;
        }
    }


    return(
        <Fragment>
        <Header /> 
            <div className="container">
                <div className="md-4 form-container">
                    <form className="add-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label for="exampleInputEmail1">Nombre del lugar</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" value={placeName} onChange={pn => handleNameChange(pn.target.value)} aria-describedby="emailHelp" placeholder="Place name"/>
                        </div>
                    
                        <div className="form-group">
                            <label for="exampleInputPassword1">Longitud</label>
                            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Longitude" value={longitude} onChange={lng => handleLngChange(lng.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label for="exampleInputPassword1">Latitud</label>
                            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Latitude" value={latitude} onChange={lat => handleLatChange(lat.target.value)}/>
                        </div>

                        <label style={{margin:'5px 0 5px 10px'}}>Puntos de interés</label>
                        <select className="form-control select" onChange={ip => handleChange(ip.target.value)} value={place}>
                            <option value="Puntos de Interes">Puntos de Interes</option>
                            <option value="Cerveceriass">Cervecerias</option>
                            <option value="Supermercados">Supermercados</option>
                            <option value="Farmacias">Farmacias</option>
                            <option value="Emergencias">Emergencias</option>
                            <option value="Universidades">Universidades</option>
                        </select>

                        <button type="submit" className="btn btn-primary" style={{margin:"5px 0 5px 120px"}}>Submit</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}