import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DataView } from 'primeng/dataview';
import { PacientesService } from 'src/app/demo/service/pacientes.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
    selector: 'app-file-upload',
})
export class CrudComponent implements OnInit {

    displayModal: boolean = false;

    fileUploaded: boolean = false;

    pacientesDialog: boolean = false;

    deletePacientesDialog: boolean = false;

    submitted: boolean = false;

    // submitted: boolean

    patient = {
      name: '',
      occupation: '',
      gender: '',
      age: 0,
      phone: ''
    }

    expedienteFhir= {
      
    }

    paciente = {
        id_paciente: 0,
        nombre: '',
        edad: 0,
        telefono: '',
        genero: '',
        ocupacion: ''
    };
    
    cols: any[] = [];

    expedienteDialog: boolean = false;

    idExpediente: number = 0; 

    fechaExpediente: string = 'ninguna';

    pacientes = [];
 
    rowsPerPageOptions = [5, 10, 20];

    uploadedFiles: string[] = [];

    expedienteData: any; // Variable para almacenar los datos

    pacienteSeleccionado: any = null;

    expedient = {
      Observations: [],
      Conditions: [],
      Procedures: [],
      MedicationStatements: []
    }

    expediente : any;

    expedientejsonDialog : boolean  = false;

    parsedDatos: any;

    /*statuses: any[] = [];*/


    constructor(private pacientesService: PacientesService, private messageService: MessageService) { }

    async ngOnInit() {
        let response = await this.pacientesService.getPacientes();
        this.pacientes = response.data;
        this.pacientes.sort((a, b) => a.id_paciente - b.id_paciente);

        this.cols = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'ocupacion', header: 'Ocupación' },
            { field: 'edad', header: 'Edad' },
            { field: 'genero', header: 'Género' },
            { field: 'telefono', header: 'Teléfono' }
        ];
    }

    async refresh() {

        let response = await this.pacientesService.getPacientes();
        this.pacientes = response.data;

    }

    openNew() {
        this.paciente = {
            id_paciente: 0,
            nombre: '',
            edad: 0,
            telefono: '',
            genero: '',
            ocupacion: ''
        };
        this.submitted = false;
        this.pacientesDialog = true;
    }

    deletePaciente(paciente: any) {
        this.deletePacientesDialog = true;
        this.paciente = { ...paciente };
    }

    async confirmDelete() {
        this.deletePacientesDialog = false;
        try {
            await this.pacientesService.deletePaciente(this.paciente.id_paciente);
            this.paciente = {
                id_paciente: 0,
                nombre: '',
                ocupacion: '',
                edad: 0,
                genero: '',
                telefono: '',
            };
            this.refresh();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente eliminado', life: 3000 });
        } catch (error) {
            console.error(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el paciente', life: 3000 });
        }
    }

    async openPatient(patient: any) {
      if (!this.patient.name) {
          console.warn("Por favor ingresa un nombre para buscar.");
          return;
      }
      this.patient = { ...patient };
      const data = await this.pacientesService.getPatient(this.patient.name);
      if (data && data.data) {
          this.patient.name = data.data.name;
          this.patient.occupation = data.data.occupation;
          this.patient.gender = data.data.gender;
          this.patient.age = data.data.age;
          this.patient.phone = data.data.phone;
      } else {
          console.error("Paciente no encontrado");
      }
  }

    transferPatientData() {
      this.paciente.nombre = this.patient.name;
      this.paciente.edad = this.patient.age;
      this.paciente.telefono = this.patient.phone;
      this.paciente.ocupacion = this.patient.occupation;
      this.paciente.genero = this.patient.gender;
    }

    async openExpFhir(paciente: any) {
      this.paciente = { ...paciente };
      try {
        let data = await this.pacientesService.getExpedienteFhir(this.paciente.nombre);
        this.expedient = {
          Observations: data.data.Observations,
          Conditions: data.data.Conditions,
          Procedures: data.data.Procedures,
          MedicationStatements: data.data.MedicationStatements,
        };
        this.expedienteDialog = true;
      } catch (error) {
        this.messageService.add({  severity: 'error', summary: 'Error', detail: 'El paciente no cuenta con registros en el servidor FHIR', life: 3000});
        console.log("Error al obtener datos del expediente:", error);
        this.vaciarExp();
      }
    }
    
  

    async openExp(paciente: any) {
      this.paciente = { ...paciente };
      try {
        const response = await this.pacientesService.getExpediente(this.paciente.id_paciente);
        this.expediente = response.data; 
        this.parsedDatos = JSON.parse(this.expediente.datos);
        this.expedientejsonDialog = true;
      } catch (error) {
        console.error('Error al obtener el expediente:', error);
      }
  }

   vaciarExp(){
    this.idExpediente = 0
    this.fechaExpediente = 'ninguna',
      this.expedient =   {
        Observations: [],
        Conditions: [],
        Procedures: [],
        MedicationStatements: []
      };
    }

    async guardarExp(){
      try{ 
          let transformar = JSON.stringify(this.expedient) //esta linea sirve para transformar el json a string
          let response = await this.pacientesService.saveExpediente(transformar, this.paciente.id_paciente)

          if (response.status==200){
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expediente Creado', life: 3000 });
              this.expedienteDialog = false;
              this.submitted = false;
               this.vaciarExp() 
              }
      } catch(error){
          this.messageService.add({  severity: 'error', summary: 'Error', detail: 'Expediente no Creado', life: 3000});
         console.log("hubo un error");
      }
      
    }

    formatJson() {
      return JSON.stringify(this.expediente, null, 2);
    }

    hideDialog() {
        this.pacientesDialog = false;
        this.submitted = false;
    }

    async savePaciente() {
      this.submitted = true;
  
      // Verifica si el formulario es válido
      //if (this.validateForm()) {
          try {
              // Asegúrate de transferir los datos si no lo has hecho ya
              this.transferPatientData(); // Asegúrate de que los datos estén en this.paciente
  
              let response = await this.pacientesService.savePaciente(
                  this.paciente.nombre,
                  this.paciente.edad,
                  this.paciente.telefono,
                  this.paciente.genero,
                  this.paciente.ocupacion,
              );
  
              if (response.status == 200) {
                  this.pacientesDialog = false;
                  this.paciente = {
                      id_paciente: 0,
                      nombre: '',
                      edad: 0,
                      telefono: '',
                      genero: '',
                      ocupacion: '',
                  };
                  this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente guardado correctamente', life: 3000 });
                  window.location.reload();
              }
          } catch (error) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Paciente no Creado', life: 3000 });
          
      //} else {
        //  this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos', life: 3000 });
      }
  }
  

    validateForm(): boolean {
        return !!this.paciente.nombre?.trim() &&
            !!this.paciente.edad &&
            !!this.paciente.telefono?.trim() &&
            !!this.paciente.genero &&
            !!this.paciente.ocupacion?.trim();
    }



    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onUpload(event: any) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            console.log(`File selected: ${file.name}`);
            this.displayModal = true;
        }
    }


async updateExp(){
    try{ 
        let transformar = JSON.stringify(this.expedient) //esta linea sirve para transformar el json a string
        let response = await this.pacientesService.updateExpediente(transformar, this.idExpediente, this.paciente.id_paciente)

        if (response.status==200){
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expediente Actualizado', life: 3000 });
            this.expedienteDialog = false;
            this.submitted = false;
             this.vaciarExp() 
            }
    } catch(error){
        this.messageService.add({  severity: 'error', summary: 'Error', detail: 'Expediente no Actualizado', life: 3000});
    }
    
  }

onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
}


selectedInfecciosas: string[] = [];
selectedCronicas: string[] = [];
selectedConsumo: string[] = [];
selectedTratamiento: string[] = [];
selectedGineco: string[] = [];
selectedPeriodo: string[] = [];
selectedSintomas: string[] = [];

periodo!: string;
cirugias!: string;
anticonceptivos!: string;
climaterio!: string;
hormonal!: string;
actividad!: string;
estiloV!: string;
apetito!: string;
controlPeso!: string;
obtuvoResultado!: string;
medicamentosBajar!: string;
cirugiaPeso!: string;


}
