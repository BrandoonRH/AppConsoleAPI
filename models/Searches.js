import fs from 'fs'; 
import axios from "axios";
import { capitalizar } from '../helpers/capitalizarText.js';

class Searches{
    history = [];
    dbPath = './database/db.json'; 

    constructor(){
        
        this.readDB();
    }

     get historyCapitalizado(){
        //Capitalizar cada Palabra 
        let HistoryCapitalizado = [];
        this.history.map(place => {
           HistoryCapitalizado =  [...HistoryCapitalizado, capitalizar(place) ]; 
        });
        //console.log(HistoryCapitalizado); 
        return HistoryCapitalizado; 
    
    }

    get paramsMapBox(){
        return {
            'language':'es',
            'limit': 5,
            'access_token': process.env.MAPBOX_KEY
        }
    }//Finish paramsMapBox

    paramsOpenWeather(lat, lon){
        return {
            'lat': lat,
            'lon': lon,
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }//Finish paramsOpenWeather

    async city (place = ''){

        try {
                //Peticion HTTP
                const http = axios.create({
                    baseURL:  `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json `,
                    params: this.paramsMapBox
                });
                const response = await http.get(); 
                return response.data.features.map(place => ({
                    id: place.id, 
                    name: place.place_name,
                    lng: place.center[0], 
                    lat: place.center[1]
                }));

        } catch (error) {
            return [];
        }
       
    }//Finish city

    async weatherPlace(lat, lon){
        try {

            const http = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: this.paramsOpenWeather(lat, lon) 
            });
            const response = await http.get(); 

            return {
                description: response.data.weather[0].description,
                min: response.data.main.temp_min,
                max: response.data.main.temp_max,
                temp: response.data.main.temp
            }
            
        } catch (error) {
            console.log(error);
        }
    }//Finish weatherPlace

    addToHistory(place = ''){
        if(this.history.includes(place.toLocaleLowerCase() ) ){
            return;
        }
        //this.history = this.history.splice(0, 5);
        this.history.unshift( place.toLocaleLowerCase() ); 
        //SAVE DataBase
        this.saveDB(); 
    }

    saveDB(){
        const payload = {
            historyPlaces: this.history
        }; 
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info); 
        this.history = data.historyPlaces; 
    }

}//Finish Class

export default Searches; 