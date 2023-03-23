import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import jsoncity from '../json/city.list.json';
interface City{
  id:number;
  name:string
}
class Settings extends React.Component {
  constructor(props: {}) {
    super(props)
    this.state = {
      data: [],
      selected:{}
    }
  }
  setSelected(id:number,name:string){
    var selected:City = {id,name}
    this.setState({selected:selected})
  }
  find(e: string) {
    this.setState({
      data: [],
    })
    var ex: City[] = []
    for (let i = 0; i < jsoncity.length; i++) {
      if (jsoncity[i]['name'].toUpperCase().startsWith(e.toUpperCase())) {
        if (ex.length >= 20) {
          break;
        }
        else {
          let res: City = jsoncity[i]
          ex.push(res)
        }
      }
    };
    if (e === "") {
      ex = []
    }
    this.setState({
      data: ex
    })
  }
  render(): React.ReactNode {
      
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonItem>
      <IonLabel position='fixed'>Default city</IonLabel>
            <IonInput   onIonChange={(e) => this.find(e.target.value)}></IonInput>
          </IonItem>
          <IonItem><IonLabel>Current : {sessionStorage.getItem('defaultCityName')}</IonLabel></IonItem>
          <IonItem><IonLabel>Selected : {this.state.selected['name']}</IonLabel></IonItem>
          <IonButton expand='full' onClick={()=>{sessionStorage.setItem('defaultCityId',this.state.selected['id'])
        sessionStorage.setItem('defaultCityName',this.state.selected['name'])
        }} >Save changes</IonButton>
          {(this.state.data.length > 0) && <IonList>
            {this.state.data.map(({ id, name }) => (
              <IonItem key={id}>
                <IonLabel onClick={() => this.setSelected(id, name)}>{name}</IonLabel>
              </IonItem>
            ))}
          </IonList>}
      </IonContent>
    </IonPage>
  );
};
}

export default Settings;
