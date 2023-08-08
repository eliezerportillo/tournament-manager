import { LineUp } from 'src/app/models/lineup';
import { MatchService } from 'src/app/services/match.service';


export class LineupBase  {
    localLineup: LineUp[];
    visitaLineup: LineUp[];
    
    


    constructor(private matchService: MatchService) {
        this.localLineup = [];
        this.visitaLineup = [];
    }

  

    get localStarting() {
        return this.localLineup.filter(x => x.titular ? true : false);
    }

    get localSubstitutes() {
        return this.localLineup.filter(x => x.startging == undefined || x.startging == false);
    }

    get visitaStarting() {
        return this.visitaLineup.filter(x => x.titular ? true : false);
    }

    get visitaSubstitutes() {
        return this.visitaLineup.filter(x => x.startging == undefined || x.startging == false);
    }
   

    protected async loadLineups(local: string, visita: string) {

        const promises = [            
            this.matchService.getLineup(local),
            this.matchService.getLineup(visita)
        ];

        const responses = await Promise.all(promises);

        
        this.localLineup = responses[0] as LineUp[];
        this.visitaLineup = responses[1] as LineUp[];

    }
}
