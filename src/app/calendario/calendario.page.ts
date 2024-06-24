import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

  minDate:any;

  constructor(
    private router: Router,
    private utilsSVC:UtilsService
  ) { 
    this.minDate = new Date().toISOString();
  }

  ngOnInit() {}

  ListarTurnos(calendar:any) {
    console.log(calendar.value)
    let fecha:string ='';
    try {
      if (calendar.value === '' || calendar.value === undefined){
        fecha = new Date().toISOString();
      }else{
        fecha = calendar.value;
      }
      fecha = this.utilsSVC.getFechaFromISO(fecha);
      this.router.navigate(['/agenda/' + fecha]);

    } catch (error) {
      console.log('Se produjo un error. Error: ' + error)
    }
  }

}
