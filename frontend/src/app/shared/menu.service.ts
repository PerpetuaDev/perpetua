import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private resetMenuSubject = new Subject<void>();
    resetMenu$ = this.resetMenuSubject.asObservable();

    resetMenu() {
        this.resetMenuSubject.next();
    }
}
