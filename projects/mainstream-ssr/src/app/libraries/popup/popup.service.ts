import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PopUp{

    private logs: Log[] = [];
    logs$ = signal<Log[]>([]);
    private removeTimeOut: any;

    add(message: string, status: PopupStatus = PopupStatus.DEFAULT, timetoutInSeconds: number = 5): void{
        let randomId;
        do {
            randomId = this.randomize(1, 100);
        } while (this.existentId(randomId));
        let theLog = { message: message, status: status, visible: true, identifier: randomId };
        this.logs.push( theLog );
        this.refreshLogs$();
        this.removeMessageAfterTimeInSeconds(theLog, timetoutInSeconds);
    }

    private refreshLogs$(){
        this.logs$.set([...this.logs]);
    }

    private removeMessageAfterTimeInSeconds(log: Log, timerInSeconds: number){
        this.removeTimeOut = setTimeout(() => {
            let logIndex = this.logs.findIndex(item => item.identifier === log.identifier);
            if(logIndex === -1) return;
            
            this.logs[logIndex] = {
                ...this.logs[logIndex],
                visible: false
            };

            setTimeout(() => {
                this.logs.splice(logIndex, 1);
                this.refreshLogs$();
            }, 500)

            this.refreshLogs$();
        }, timerInSeconds * 1000)
    }

    private randomize(min: number, max: number): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private existentId(id: number): boolean{
       return (this.logs.filter(item => item.identifier === id).length > 0) ? true : false;
    }

}

export enum PopupStatus{
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    DEFAULT = 'default'
}

interface Log{
    message: string,
    status: PopupStatus,
    identifier: number,
    visible: boolean
}