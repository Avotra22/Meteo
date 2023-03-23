import { IonLoading, IonLabel, IonItem, IonList, IonInput, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonToast } from '@ionic/react';
import React from 'react';
import './weather.css'
import jsc from '../json/city.list.json';
interface City{
  coord:{
    long:number,
    lat:number
  },
  weather:[
    {
      id:number,
      main:string,
      description:string,
      icon:string
    }
  ]
,
base:string,
main:{
  temp:number,
  feels_like:number,
  temp_min:number,
  temp_max:number,
  pressure:number,
  humidity:number
},
visibility:number,
wind:{
  speed:number,
  deg:number
},
clouds:{
  all:number
},
dt:number,
sys:{
  type:number,
  id:number,
  country:string,
  sunrise:number,
  sunset:number
},
timezone:number,
id:number,
name:string,
cod:number
  }
  
interface Ville{
  id:number,
  name:string,
  state:string,
  country:string,
  coord:{
    lon:number,
    lat:number
  }
}
class Weather extends React.Component<{},{data:Ville[],result:City|null,connectionError:boolean,encours:boolean,find:string}> {
  constructor(props: {}) {
    super(props)
    this.state = {
      data: [],
      result: null,
      find: "",
      encours: false,
      connectionError: false
    }
  }

  async getWeather(id: number) {
    await this.setState({
      data: [],
      result: null,
      find: "",
      encours: true
    })
    var url = "https://api.openweathermap.org/data/2.5/weather?id=" + id + "&appid=f59e3712c7a9035a371572f1e6bc518f&units=metric"
    await fetch(url)
      .then(response => response.json()
      )
      .then(data => this.setState({ result: data }))
      .catch(() => { this.setState({ connectionError: true }) })
    this.setState({
      encours: false
    })

  }
  find(e: string) {
    //console.log(Object.values(jsoncity));
    
    this.setState({
      data: [],
      find: e,
      result: null
    })
    var temp :Ville[]= []
    var jsoncity : Ville[] = Object.values(jsc) as Ville[]   
    for (let i = 0; i < jsoncity.length; i++) {
      var t : Ville = jsoncity[i]
      if (t['name'].toUpperCase().startsWith(e.toUpperCase())) {
        if (temp.length >= 10) {
          break;
        }
        else {
          temp.push(t)
        }
      }
    };
    if (e === "") {
      temp = []
    }
    this.setState({
      data: temp
    })
  }
  componentDidMount(): void {


    if (sessionStorage.getItem('defaultCityId') != null) {
      this.getWeather(parseInt(sessionStorage.getItem('defaultCityId')!))
    }
  }
  render(): React.ReactNode {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Weather</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItem>
            <IonLabel position='fixed'>Find a city</IonLabel>
            <IonInput id='input' onIonChange={(e:any) => this.find(e.target.value)}></IonInput>
          </IonItem>
          {(this.state.data.length > 0) && <IonList>
            {this.state.data.map(({ id, name }) => (
              <IonItem key={id}>
                <IonLabel onClick={() => this.getWeather(id)}>{name}</IonLabel>
                <IonLabel >{this.state.encours}</IonLabel>
              </IonItem>
            ))}
          </IonList>}
          {(this.state.data.length === 0 && this.state.find !== "") && <IonItem>
            <IonLabel>No result found</IonLabel>
          </IonItem>}
          {(this.state.result !== null && <IonContent className='vertical-center'>
            <IonLabel className='city-name'>
              {this.state.result['name']},{this.state.result['sys']['country']}
            </IonLabel>
            <IonImg className='img' src={"https://openweathermap.org/img/wn/" + this.state.result['weather'][0]['icon'] + "@2x.png"} style={{ width: '120px' }}></IonImg>
            <IonContent className='cont' ><IonLabel className='description'>{this.state.result['weather'][0]['description']}</IonLabel><br /><IonLabel className='degreeC'>{this.state.result['main']['temp']}°C</IonLabel> </IonContent>
            <IonContent className='block'><IonLabel className='item'>Visibility : {this.state.result['visibility']}</IonLabel><br /><IonLabel className='item'>Humidity : {this.state.result['main']['humidity']}</IonLabel><br /><IonLabel className='item'>Temp : {this.state.result['main']['temp']}°C</IonLabel><br /><IonLabel className='item'>Wind speed : {this.state.result['wind']['speed']}</IonLabel><br /><IonLabel className='item'>Wind deg : {this.state.result['wind']['deg']}°</IonLabel><br /></IonContent>
          </IonContent>)}
          <IonLoading
            isOpen={this.state.encours}
            message={'Please wait...'}
          />
          <IonToast
            isOpen={this.state.connectionError} 
            message="Network error!"
            duration={3000}
            position="middle"
            color="primary"
          />
        </IonContent>
      </IonPage>
    );
  };
}
export default Weather;