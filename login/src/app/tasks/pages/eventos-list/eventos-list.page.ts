import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Evento } from '../../models/evento.model';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-eventos-list',
  templateUrl: './eventos-list.page.html',
  styleUrls: ['./eventos-list.page.scss']
})
export class EventosListPage implements OnInit {
  eventos$: Observable<Evento[]>;

  constructor(
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private eventosService: EventosService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.eventos$ = this.eventosService.getAll();
    this.eventos$.pipe(take(1)).subscribe(eventos => loading.dismiss());
  }
  onUpdate(evento: Evento): void {
    this.navCtrl.navigateForward(`/tasks/eventos/edit/${evento.id}`);
  }

  async onDelete(evento: Evento): Promise<void> {
    await this.overlayService.alert({
      message: `Voce realmente deseja apagar a tarefa "${evento.title}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.eventosService.delete(evento);
            await this.overlayService.toast({
              message: `Evento "${evento.title}" deleted!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async onDone(evento: Evento): Promise<void> {
    const eventoToUpdate = { ...evento, done: !evento.done };
    await this.eventosService.update(eventoToUpdate);
    await this.overlayService.toast({
      message: `Evento "${evento.title}" ${eventoToUpdate.done ? 'completed' : 'updated'}!`
    });
  }
}
