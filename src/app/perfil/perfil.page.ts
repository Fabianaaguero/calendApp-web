import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public email: any = '';
  public nombre: any = '';
  public apellido: any = '';
  public fechaFinSuscr: any = '';
  public tipoSuscripcion:any = '';

  constructor(
    private menu: MenuController,
    private usuarioService: UsuarioService,
    private utilSVC: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {

    try {
      this.email = sessionStorage.getItem('emailUserApp');
      this.nombre = sessionStorage.getItem('nombreUsuario');
      this.apellido = sessionStorage.getItem('apellidoUsuario');
      this.fechaFinSuscr = sessionStorage.getItem('finSuscripcion');
      this.fechaFinSuscr = this.utilSVC.getFechaFromISO(this.fechaFinSuscr);
      this.tipoSuscripcion = sessionStorage.getItem('tipoSuscripcion');
    } catch (error) {
      console.log('Perfil. Error:' + error);
    }

  }

}
