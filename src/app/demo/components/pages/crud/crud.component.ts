import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
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

    // submitted: boolean;


    pacientes = [];

    paciente = {
        id_paciente: 0,
        nombre: '',
        edad: 0,
        telefono: '',
        genero: '',
        ocupacion: ''
    };

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    uploadedFiles: string[] = [];

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


    hideDialog() {
        this.pacientesDialog = false;
        this.submitted = false;
    }


    //    async savePaciente() {
    //         this.submitted = true;

    //         if (this.paciente.nombre?.trim()) {
    //             try {
    //                 let response = await this.pacientesService.savePaciente(
    //                     this.paciente.nombre,
    //                     this.paciente.edad,
    //                     this.paciente.telefono,
    //                     this.paciente.genero,
    //                     this.paciente.ocupacion,
    //                 );

    //                 if (response.status == 200) {
    //                     this.pacientesDialog = false;
    //                     this.paciente = {
    //                         id_paciente: 0,
    //                         nombre: '',
    //                         edad: 0,
    //                         telefono: '',
    //                         genero: '',
    //                         ocupacion: '',
    //                     };
    //                     window.location.reload()
    //                    }
    //            } catch(error){
    //                this.messageService.add({  severity: 'error', summary: 'Error', detail: 'Paciente no Creado', life: 3000});
    //            }
    //         }
    //     }


    async savePaciente() {
        this.submitted = true;

        if (this.validateForm()) {
            try {
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
                }
            } catch (error) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Paciente no Creado', life: 3000 });
            }
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos', life: 3000 });
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

//    este metodo era para comenzar a hacer lo de los expedientes 
// async openExp(paciente: any) {
         
//         this.paciente = { ...paciente };
//         try{ 
//          let data = await this.pacientesService.getExpediente(this.paciente.id_paciente)
//         //    this.idExpediente = data.data["id_expediente"]
//         //    this.fechaExpediente = data.data["fecha_modificacion"]??"ninguna"
//            this.expediente = JSON.parse(data.data["datos"])
//            this.submitted = false;
//            this.expedienteDialog = true;
//          }catch(error){
//            this.vaciarExp()
//            this.submitted = false;
//            this.expedienteDialog = true;
//            console.log("Este expediente se encuentra vacío")
//          }
          
//    }

}
