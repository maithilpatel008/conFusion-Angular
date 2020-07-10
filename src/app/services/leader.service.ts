import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  leader: Leader;

  getLeaders(): Promise<Leader[]> {
    //return Promise.resolve(LEADERS);
    return new Promise( resolve => {
      setTimeout( () => resolve(LEADERS), 2000);
    });
  }

  getLeader(id: string): Promise<Leader> {
    //return Promise.resolve(this.leader = LEADERS.filter( (leader) => leader.id === id)[0]);
    return new Promise( resolve => {
      setTimeout( () => resolve( LEADERS.filter( (leader) => leader.id === id)[0]), 2000);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    //return Promise.resolve(this.leader = LEADERS.filter( (leader) => leader.featured)[0]);
    return new Promise( resolve => {
      setTimeout( () => resolve( LEADERS.filter( (leader) => leader.featured)[0]), 2000);
    });
  }
}