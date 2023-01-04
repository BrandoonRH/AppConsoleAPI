import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { readInput, inquirerMenu, pause, ListPlaces } from "./helpers/inquirer.js";
import Searches from "./models/Searches.js";


const main = async () => {
    const searches = new Searches(); 
    let opt;

    
    do {
        opt = await inquirerMenu();
        
        switch(opt){
    
            case 1: 
                //Show Message 
                const place = await readInput('Ciudad: '); 
                
                //Search the places
                const places = await searches.city(place); 
               
                //Select the place 
                const id = await ListPlaces(places);
                if(id === '0' ) continue; 

                

                const placeSelect = places.find( p => p.id === id );
                //save DataBase 
                searches.addToHistory(placeSelect.name); 

                const weather = await searches.weatherPlace(placeSelect.lat, placeSelect.lng);
                 
                //Show Results 
                console.log('\nInformación de la Ciudad\n'.green);
                console.log('Ciudad: '.grey, placeSelect.name);
                console.log('Lat:'.gray, placeSelect.lat);
                console.log('Lng:'.gray, placeSelect.lng);
                console.log('Temperatura: '.gray, weather.temp);
                console.log('Máxima: '.gray, weather.max);
                console.log('Mínima: '.gray, weather.min);
                console.log('Como esta el Clima: '.gray, weather.description); 

            break; 
    
            case 2: 
            searches.historyCapitalizado.forEach( (place, id) => {
                const idx = `${id + 1 }.`.green;
                console.log(`${idx} ${place}`);
            })
            break;  
    
        }//Finish switch
    
        await pause();
        
    
        
      } while (opt !== 0);

}//Finish main

main(); 