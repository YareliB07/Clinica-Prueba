import { Injectable } from '@angular/core';
import axios from 'axios';
import * as moment from 'moment';


@Injectable({providedIn:"root"})
export class PacientesService {

    constructor() { }

    //url='https://fastapi-service-fhatimareyes.cloud.okteto.net/' 
    url='http://127.0.0.1:8001/' 
    
    async getPacientes() {
       return await axios.get(this.url+'pacientes/')
    }

    async getPatient(name: string) {
        return await axios.get(`${this.url}patient/`, { params: { name } });
    }
    
    async getExpedienteFhir(name: string) {
        return await axios.get(`${this.url}get_expediente_fhir/${name}`);
    }

    async savePaciente(nombre: string, edad:number, telefono:string, genero: string, ocupacion:string){
        return await axios.post(this.url+'pacientes/', 
        {
            nombre: nombre,
            edad: edad,
            telefono: telefono,
            genero: genero,
            ocupacion: ocupacion},
            {headers:{"Content-Type":"application/json"}}) //una cabezera para comunicarse
    }

    async updatePaciente(id: number, nombre: string, ocupacion:string, edad:number, genero: string, telefono:string){
        return await axios.put(this.url+'pacientes/'+id, 
        {
            nombre: nombre,
            ocupacion: ocupacion,
            edad: edad,
            genero: genero,
            telefono: telefono},
            {headers:{"Content-Type":"application/json"}})
    }

   async deletePaciente(id: number){
    return await axios.delete(this.url+'pacientes/'+id)
   }

   async saveExpediente(datos: string, id_paciente: number){
    let fecha = moment(Date.now()).format("YYYY-MM-DD") //variable para darle formato a la fecha de modificacion del Exp
    return await axios.post(this.url+'expedientes/', 
    {
        fecha_modificacion: fecha,
        datos: datos,
        id_paciente: id_paciente},{headers:{"Content-Type":"application/json"}}) //una cabezera para comunicarse
  }
   
  async getExpediente(id:number) {
    return await axios.get(this.url+'expedientes/paciente/'+id)
 }

 async updateExpediente(datos: string, idExpediente: number, id_paciente: number){
    let fecha = moment(Date.now()).format("YYYY-MM-DD") //variable para darle formato a la fecha de modificacion del Exp
    return await axios.put(this.url+'expedientes/'+idExpediente, 
    {
        fecha_modificacion: fecha,
        datos: datos,
        id_paciente: id_paciente
    },{headers:{"Content-Type":"application/json"}}) //una cabezera para comunicarse
  }

}


