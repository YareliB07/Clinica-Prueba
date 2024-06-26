import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
    selector: 'app-file-upload',
})
export class CrudComponent implements OnInit {

    displayModal: boolean = false;

    fileUploaded: boolean = false;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    //deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    /*statuses: any[] = [];*/

    rowsPerPageOptions = [5, 10, 20];

    uploadedFiles: string[] = [];

    constructor(private productService: ProductService, private messageService: MessageService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'ocupacion', header: 'Ocupación' },
            { field: 'edad', header: 'Edad' },
            { field: 'genero', header: 'Género' },
            { field: 'telefono', header: 'Teléfono' }
        ];

        /*this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];*/
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    /*editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }*/

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    /*confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }*/

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente eliminado', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.nombre?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente creado', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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
}
